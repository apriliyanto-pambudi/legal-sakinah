"use client";

/**
 * Pengiriman event klik CTA — PRD Section 4 (Alur klik CTA) & 6.4.
 *
 * Kontrak yang tidak boleh dilanggar:
 * - fire-and-forget: tidak ada `await`, tidak ada `preventDefault` + `setTimeout`
 * - kegagalan apa pun di sini tidak boleh menghalangi navigasi ke WhatsApp
 */

import { sendGAEvent } from "@next/third-parties/google";
import { GA4_CTA_EVENT, isGa4Enabled } from "./analytics";
import { getSessionId, getStoredUtm } from "./utm";
import type { CtaEventPayload } from "./validations/cta-event";

const CTA_ENDPOINT = "/api/events/cta";

export function buildCtaPayload(
  ctaLabel: string,
  lpSlug: string | null
): CtaEventPayload {
  return {
    page_path: window.location.pathname,
    lp_slug: lpSlug,
    cta_label: ctaLabel,
    referrer: document.referrer || null,
    session_id: getSessionId(),
    client_timestamp: new Date().toISOString(),
    ...getStoredUtm(),
  };
}

function sendToBackend(payload: CtaEventPayload): void {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    // sendBeacon bertahan melewati unload halaman — jalur utama saat CTA
    // memicu navigasi ke WhatsApp.
    const queued = navigator.sendBeacon(
      CTA_ENDPOINT,
      new Blob([body], { type: "application/json" })
    );
    if (queued) return;
  }

  // Fallback: keepalive agar request tetap jalan setelah halaman ditinggalkan.
  void fetch(CTA_ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

function sendToGa4(payload: CtaEventPayload): void {
  if (!isGa4Enabled) return;
  sendGAEvent("event", GA4_CTA_EVENT, {
    page_path: payload.page_path,
    lp_slug: payload.lp_slug ?? undefined,
    cta_label: payload.cta_label,
    utm_source: payload.utm_source ?? undefined,
    utm_medium: payload.utm_medium ?? undefined,
    utm_campaign: payload.utm_campaign ?? undefined,
    utm_content: payload.utm_content ?? undefined,
    utm_term: payload.utm_term ?? undefined,
  });
}

/**
 * Catat klik CTA ke database (sumber kebenaran dashboard) dan cermin ke GA4.
 * Keduanya berjalan paralel dan tidak menunda pembukaan WhatsApp.
 */
export function trackCtaClick(ctaLabel: string, lpSlug: string | null): void {
  try {
    const payload = buildCtaPayload(ctaLabel, lpSlug);
    sendToBackend(payload);
    sendToGa4(payload);
  } catch {
    // Diabaikan dengan sengaja: konversi lebih penting daripada telemetri.
  }
}
