import { z } from "zod";

/**
 * Skema payload POST /api/events/cta — PRD Section 4 (Alur klik CTA) & 6.4.
 *
 * Aturan:
 * - Whitelist ketat: field di luar daftar ini ditolak.
 * - UTM disimpan APA ADANYA — hanya trim + potong panjang, tanpa lowercase,
 *   tanpa mapping alias, tanpa placeholder untuk nilai kosong.
 * - `user_agent`, IP, `page_type`, dan `occurred_at` TIDAK diterima dari client;
 *   semuanya ditentukan server.
 */

/** Trim, jadikan null bila kosong, lalu potong pada batas maksimum. */
function limitedText(max: number) {
  return z
    .string()
    .nullish()
    .transform((value) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed.slice(0, max);
    });
}

const utmField = limitedText(255);

export const ctaEventSchema = z.strictObject({
  page_path: z
    .string()
    .min(1)
    .max(512)
    .transform((value) => value.trim())
    .refine((value) => value.startsWith("/"), {
      message: "page_path harus berupa path absolut",
    }),

  /** Diisi hanya bila klik berasal dari LP ads. */
  lp_slug: limitedText(128),

  /** Konvensi label: hero_wa, sticky_wa, footer_wa, faq_wa, ... */
  cta_label: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9_-]+$/, "cta_label hanya boleh a-z, 0-9, _ dan -"),

  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_content: utmField,
  utm_term: utmField,

  referrer: limitedText(512),

  /** ID acak dari sessionStorage — dipakai untuk deduplikasi, bukan identitas. */
  session_id: limitedText(64),

  /** Waktu client hanya referensi; agregasi memakai waktu server. */
  client_timestamp: z
    .string()
    .nullish()
    .transform((value) => {
      if (typeof value !== "string") return null;
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }),
});

/** Bentuk payload yang dikirim client (sebelum transform). */
export type CtaEventPayload = z.input<typeof ctaEventSchema>;

/** Bentuk payload setelah divalidasi & dinormalisasi ringan di server. */
export type CtaEventInput = z.output<typeof ctaEventSchema>;
