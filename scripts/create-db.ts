/**
 * Membuat database jika belum ada.
 *
 * Jalankan:  pnpm db:create
 *
 * Terhubung ke database bawaan `postgres` lalu menjalankan CREATE DATABASE,
 * karena PostgreSQL tidak mengizinkan CREATE DATABASE di dalam transaksi
 * pada koneksi ke database target.
 */

import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL belum diset di .env.local");
  }

  const parsed = new URL(url);
  const dbName = parsed.pathname.replace(/^\//, "");

  if (!dbName) {
    throw new Error("Nama database tidak ditemukan pada DATABASE_URL");
  }

  // Sambungkan ke database administratif `postgres`
  const adminUrl = new URL(url);
  adminUrl.pathname = "/postgres";

  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();

  try {
    const existing = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`Database "${dbName}" sudah ada.`);
      return;
    }

    // Identifier tidak bisa diparameterisasi — kutip ganda untuk mencegah injeksi
    await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
    console.log(`Database "${dbName}" berhasil dibuat.`);
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(
      "Gagal membuat database:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  });
