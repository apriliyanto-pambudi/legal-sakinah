/**
 * Konfigurasi analytics publik.
 *
 * Hanya konstanta agar aman diimpor dari server maupun client component.
 * Pengiriman event ada di `src/lib/cta-tracking.ts` (client-only).
 */

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";

/** GA4 nonaktif selama measurement ID belum diisi — lihat .env.example. */
export const isGa4Enabled = GA4_MEASUREMENT_ID.length > 0;

/** Nama event GA4 untuk klik CTA WhatsApp (mirror dari tabel cta_clicks). */
export const GA4_CTA_EVENT = "cta_whatsapp_click";
