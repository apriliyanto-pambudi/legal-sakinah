/**
 * Membuat atau memperbaiki akun admin awal.
 *
 * Jalankan:  pnpm db:seed-admin
 *
 * Kredensial dibaca dari environment:
 *   SEED_ADMIN_EMAIL
 *   SEED_ADMIN_PASSWORD   (minimal 12 karakter)
 *   SEED_ADMIN_NAME       (opsional)
 *
 * Idempoten: jika admin sudah ada, script memperbarui passwordnya dan
 * memastikan role serta status aktifnya benar. Ini sekaligus menjadi jalur
 * reset password manual (PRD menandai reset mandiri sebagai [TBD]).
 *
 * Pembuatan akun memakai API sign-up better-auth pada instance khusus seeding
 * agar hashing dan bentuk baris akun identik dengan yang diharapkan proses login.
 * Endpoint publik tetap menolak pendaftaran.
 */

import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin Legal Sakinah";

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diset di .env.local"
    );
  }

  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD minimal 12 karakter");
  }

  // Import setelah dotenv agar validasi env membaca nilai yang benar
  const { eq } = await import("drizzle-orm");
  const { betterAuth } = await import("better-auth");
  const { db } = await import("../src/server/db");
  const { users } = await import("../src/server/db/schema");
  const { buildAuthOptions } = await import("../src/server/auth/auth");

  const seedAuth = betterAuth(buildAuthOptions({ allowSignUp: true }));

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    const ctx = await seedAuth.$context;
    const passwordHash = await ctx.password.hash(password);

    // updatePassword mencocokkan providerId + issuer + accountId internal
    await ctx.internalAdapter.updatePassword(existing.id, passwordHash);
    await db
      .update(users)
      .set({
        role: "admin",
        isActive: true,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));

    console.log(`Admin ${email} sudah ada — password diperbarui.`);
    return;
  }

  const created = await seedAuth.api.signUpEmail({
    body: { email, password, name },
  });

  if (!created?.user) {
    throw new Error("better-auth tidak mengembalikan user setelah sign-up.");
  }

  // role & isActive bertanda input:false, jadi diset langsung di DB
  await db
    .update(users)
    .set({ role: "admin", isActive: true, emailVerified: true })
    .where(eq(users.email, email));

  console.log(`Admin berhasil dibuat: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(
      "Seed admin gagal:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  });
