/**
 * Menghapus lalu membuat ulang database — HANYA untuk development.
 *
 * Jalankan:  pnpm db:reset
 *
 * Seluruh data akan hilang. Script menolak berjalan bila NODE_ENV=production
 * atau bila DATABASE_URL tidak menunjuk ke localhost.
 */

import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("db:reset tidak boleh dijalankan di production.");
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diset di .env.local");

  const parsed = new URL(url);
  const host = parsed.hostname;

  if (host !== "localhost" && host !== "127.0.0.1") {
    throw new Error(
      `db:reset hanya untuk database lokal. Host terdeteksi: ${host}`
    );
  }

  const dbName = parsed.pathname.replace(/^\//, "");
  if (!dbName) throw new Error("Nama database tidak ditemukan pada DATABASE_URL");

  const adminUrl = new URL(url);
  adminUrl.pathname = "/postgres";

  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();

  const quoted = `"${dbName.replace(/"/g, '""')}"`;

  try {
    // Tutup koneksi lain agar DROP DATABASE tidak diblokir
    await client.query(
      "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
      [dbName]
    );
    await client.query(`DROP DATABASE IF EXISTS ${quoted}`);
    await client.query(`CREATE DATABASE ${quoted}`);
    console.log(`Database "${dbName}" berhasil di-reset.`);
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(
      "Reset database gagal:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  });
