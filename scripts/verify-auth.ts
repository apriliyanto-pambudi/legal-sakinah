/**
 * Verifikasi alur auth Tahap 2 terhadap dev server yang sedang berjalan.
 *
 * Jalankan:  pnpm tsx scripts/verify-auth.ts
 *
 * Memeriksa:
 *  1. /admin tanpa session  → redirect ke /admin/login
 *  2. Login dengan password salah → gagal
 *  3. Login dengan kredensial benar → dapat cookie session
 *  4. /admin dengan session → 200
 *
 * Script bantu untuk pengujian lokal; tidak dipakai di production.
 */

import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail = "") {
  if (ok) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;

  console.log(`\nVerifikasi auth di ${BASE}\n`);

  // 1. Guard middleware: /admin tanpa session
  const anon = await fetch(`${BASE}/admin`, { redirect: "manual" });
  const anonLocation = anon.headers.get("location") ?? "";
  check(
    "/admin tanpa session → redirect ke login",
    anon.status >= 300 && anon.status < 400 && anonLocation.includes("/admin/login"),
    `status=${anon.status} location=${anonLocation}`
  );

  // Origin wajib — better-auth menolak mutasi tanpa Origin (proteksi CSRF)
  const jsonHeaders = {
    "Content-Type": "application/json",
    Origin: BASE,
  };

  // 2. CSRF: mutasi tanpa header Origin harus ditolak
  const noOrigin = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  check(
    "login tanpa Origin → ditolak (CSRF)",
    noOrigin.status === 403,
    `status=${noOrigin.status}`
  );

  // 3. Login dengan password salah
  const badLogin = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password: "passwordSalah123" }),
  });
  check(
    "login password salah → ditolak",
    !badLogin.ok,
    `status=${badLogin.status}`
  );

  // 4. Login dengan kredensial benar
  const login = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  });

  const setCookie = login.headers.getSetCookie?.() ?? [];
  const cookieHeader = setCookie
    .map((c) => c.split(";")[0])
    .join("; ");

  check(
    "login kredensial benar → dapat cookie session",
    login.ok && cookieHeader.includes("session_token"),
    login.ok ? `cookies=${setCookie.length}` : `status=${login.status} body=${await login.text()}`
  );

  if (!cookieHeader) {
    console.log("\nTidak ada cookie — pengujian berhenti.\n");
    process.exit(1);
  }

  // 4. Akses /admin dengan session
  const authed = await fetch(`${BASE}/admin`, {
    headers: { cookie: cookieHeader },
    redirect: "manual",
  });
  check(
    "/admin dengan session → 200",
    authed.status === 200,
    `status=${authed.status} location=${authed.headers.get("location") ?? "-"}`
  );

  // 5. Session endpoint mengembalikan role admin
  const sessionRes = await fetch(`${BASE}/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
  });
  const session = sessionRes.ok ? await sessionRes.json() : null;
  check(
    "session memuat role=admin",
    session?.user?.role === "admin",
    `role=${session?.user?.role ?? "-"}`
  );

  console.log(`\n${passed} lolos, ${failed} gagal\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Verifikasi error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
