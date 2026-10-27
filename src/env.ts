/**
 * Validasi environment variable saat startup.
 * Gagal cepat dengan pesan jelas daripada error samar di runtime.
 */

import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET minimal 32 karakter"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  CTA_EVENT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(20),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/**
 * Ambil env server yang sudah tervalidasi.
 * Hanya boleh dipanggil dari kode server (bukan komponen client).
 */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Environment variable tidak valid:\n${issues}\n\nSalin .env.example ke .env.local lalu isi nilainya.`
    );
  }

  cached = parsed.data;
  return cached;
}
