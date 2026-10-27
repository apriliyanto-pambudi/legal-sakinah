import { createHash } from "node:crypto";
import { getServerEnv } from "@/env";

/**
 * Metadata request untuk endpoint publik.
 *
 * PRD Section 5.4 & 6.4: IP mentah TIDAK boleh disimpan atau di-log.
 * Yang disimpan hanya hash IP dengan salt yang berganti setiap hari.
 */

const MAX_USER_AGENT_LENGTH = 512;

/**
 * Nginx meneruskan IP asli lewat X-Forwarded-For (lihat PRD Section 3.5).
 * Entri pertama adalah client; sisanya rantai proxy.
 */
export function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || null;
}

/**
 * Hash IP + salt harian.
 *
 * Salt berganti tiap hari (UTC) sehingga baris event dari hari berbeda tidak
 * bisa dihubungkan ke pengunjung yang sama, dan hash tidak bisa dibalik ke IP
 * tanpa mengetahui auth secret.
 */
export function hashIp(ip: string): string {
  const dailySalt = `${getServerEnv().BETTER_AUTH_SECRET}:${new Date()
    .toISOString()
    .slice(0, 10)}`;
  return createHash("sha256").update(`${dailySalt}:${ip}`).digest("hex");
}

export function getUserAgent(request: Request): string | null {
  const userAgent = request.headers.get("user-agent")?.trim();
  return userAgent ? userAgent.slice(0, MAX_USER_AGENT_LENGTH) : null;
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export function deviceTypeFromUserAgent(
  userAgent: string | null
): DeviceType | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

function allowedOrigins(request: Request): Set<string> {
  const origins = new Set<string>();

  // Origin sebagaimana dilihat browser saat ini (dev port, domain staging, dst.)
  const host = request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    origins.add(`${proto || "http"}://${host}`);
    origins.add(`https://${host}`);
  }

  for (const configured of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.BETTER_AUTH_URL,
  ]) {
    if (!configured) continue;
    try {
      origins.add(new URL(configured).origin);
    } catch {
      // Nilai env tidak valid — abaikan, host header tetap jadi acuan.
    }
  }

  return origins;
}

/**
 * Tolak request lintas domain (PRD Section 6.4: hanya terima dari domain
 * sendiri). Request tanpa Origin maupun Referer juga ditolak karena browser
 * selalu mengirim Origin pada POST.
 */
export function isSameOriginRequest(request: Request): boolean {
  const allowed = allowedOrigins(request);

  const origin = request.headers.get("origin");
  if (origin) return allowed.has(origin);

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return false;
}
