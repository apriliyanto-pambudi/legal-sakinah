import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getServerEnv } from "@/env";
import * as schema from "./schema";

/**
 * Koneksi Drizzle + pool pg.
 *
 * Pool disimpan di globalThis agar tidak membuat koneksi baru
 * setiap kali modul di-reload saat development (HMR).
 */

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

function createPool(): Pool {
  const { DATABASE_URL, NODE_ENV } = getServerEnv();
  return new Pool({
    connectionString: DATABASE_URL,
    max: NODE_ENV === "production" ? 10 : 5,
  });
}

const pool = globalForDb.pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
