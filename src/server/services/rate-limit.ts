/**
 * Rate limit in-memory dengan fixed window — PRD Section 3.1 ("sederhana,
 * v1 tanpa Redis") dan 6.4.
 *
 * Catatan operasional: hitungan bersifat per proses. Saat PM2 berjalan dalam
 * mode cluster, batas efektif adalah `limit × jumlah instance`. Pindah ke Redis
 * bila butuh batas yang akurat lintas instance.
 */

const WINDOW_MS = 60_000;
/** Ambang sapu bersih agar Map tidak tumbuh tanpa batas saat diserang. */
const MAX_TRACKED_KEYS = 10_000;

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as unknown as {
  rateLimitBuckets?: Map<string, Bucket>;
};

const buckets =
  globalForRateLimit.rateLimitBuckets ?? new Map<string, Bucket>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitBuckets = buckets;
}

function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Detik hingga window berikutnya — dipakai untuk header Retry-After. */
  retryAfterSeconds: number;
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number = WINDOW_MS
): RateLimitResult {
  const now = Date.now();

  if (buckets.size >= MAX_TRACKED_KEYS) sweepExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
