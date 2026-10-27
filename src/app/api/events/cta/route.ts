import { getServerEnv } from "@/env";
import { ctaEventSchema } from "@/lib/validations/cta-event";
import { recordCtaClick } from "@/server/services/cta-events";
import { consumeRateLimit } from "@/server/services/rate-limit";
import {
  getClientIp,
  getUserAgent,
  hashIp,
  isSameOriginRequest,
} from "@/server/services/request-meta";

/**
 * POST /api/events/cta — target `navigator.sendBeacon` untuk klik CTA WhatsApp.
 *
 * PRD Section 4 (Alur klik CTA) & 6.4:
 * - selalu balas 204 tanpa body, secepat mungkin
 * - kegagalan penyimpanan tidak dikembalikan sebagai error ke pengunjung
 * - IP mentah tidak disimpan maupun di-log
 */

export const runtime = "nodejs";

/** Batas ukuran body (PRD Section 6.4). */
const MAX_BODY_BYTES = 4096;

function noContent(): Response {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) {
    return new Response(null, { status: 403 });
  }

  const { CTA_EVENT_RATE_LIMIT_PER_MINUTE } = getServerEnv();

  const clientIp = getClientIp(request);
  const ipHash = clientIp ? hashIp(clientIp) : null;

  const rateLimit = consumeRateLimit(
    `cta:${ipHash ?? "unknown"}`,
    CTA_EVENT_RATE_LIMIT_PER_MINUTE
  );
  if (!rateLimit.allowed) {
    return new Response(null, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }

  const parsed = ctaEventSchema.safeParse(json);
  if (!parsed.success) {
    // Hanya nama field yang di-log — payload utuh tidak boleh masuk log.
    console.warn(
      "[cta-event] payload ditolak:",
      parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")
    );
    return new Response(null, { status: 400 });
  }

  try {
    await recordCtaClick(parsed.data, {
      userAgent: getUserAgent(request),
      ipHash,
    });
  } catch (error) {
    // Konversi tidak boleh terganggu oleh kegagalan pencatatan.
    console.error("[cta-event] gagal menyimpan event:", error);
  }

  return noContent();
}
