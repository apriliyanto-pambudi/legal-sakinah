import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { getServerEnv } from "@/env";

/**
 * Konfigurasi better-auth — email + password, role admin.
 *
 * Catatan:
 * - Tidak ada registrasi publik. Akun admin dibuat lewat scripts/seed-admin.ts.
 * - ID di-generate oleh database (uuid gen_random_uuid()) sesuai PRD Section 5.
 * - Nama tabel di PRD berbentuk plural, sedangkan model better-auth singular,
 *   sehingga keduanya dipetakan pada opsi adapter.
 */

/**
 * @param allowSignUp Hanya diaktifkan oleh script seeding internal supaya
 *   pembuatan akun admin memakai code path resmi better-auth (hashing
 *   dan bentuk baris akun dijamin konsisten dengan proses login).
 *   Endpoint publik selalu memakai nilai default `false`.
 */
export function buildAuthOptions(
  { allowSignUp = false }: { allowSignUp?: boolean } = {}
): BetterAuthOptions {
  const env = getServerEnv();

  return {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...schema,
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),

    advanced: {
      database: {
        // Biarkan PostgreSQL membuat UUID via gen_random_uuid()
        generateId: false,
      },
    },

    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      requireEmailVerification: false,
      minPasswordLength: 12,
    },

    session: {
      // 7 hari (indikatif — PRD menandai durasi final sebagai [TBD])
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "admin",
          // Jangan biarkan role diubah lewat API update profil
          input: false,
        },
        isActive: {
          type: "boolean",
          required: false,
          defaultValue: true,
          input: false,
        },
      },
    },

    // nextCookies harus menjadi plugin terakhir
    plugins: [nextCookies()],
  };
}

export const auth = betterAuth(buildAuthOptions());

export type AuthSession = typeof auth.$Infer.Session;
