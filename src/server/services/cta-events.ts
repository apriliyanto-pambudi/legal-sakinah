import { sql, type SQL } from "drizzle-orm";
import { db } from "@/server/db";
import { ctaClicks } from "@/server/db/schema";
import type { CtaEventInput } from "@/lib/validations/cta-event";
import { deviceTypeFromUserAgent } from "./request-meta";

/**
 * Penyimpanan event klik CTA — PRD Section 5.4.
 *
 * `occurred_at` memakai default now() dari database agar seluruh agregasi
 * dashboard berdiri di atas waktu server, bukan waktu client.
 */

/** PRD Section 6.4: jendela dedup indikatif 10 detik. */
const DEDUPE_WINDOW_SECONDS = 10;

export interface CtaEventContext {
  userAgent: string | null;
  ipHash: string | null;
}

/**
 * Klik berulang (double tap, tombol yang sama) tetap disimpan tetapi ditandai
 * agar bisa dikecualikan dari metrik utama di dashboard.
 */
function duplicateFlag(input: CtaEventInput): SQL<boolean> | boolean {
  if (!input.session_id) return false;

  return sql<boolean>`EXISTS (
    SELECT 1
    FROM ${ctaClicks}
    WHERE ${ctaClicks.sessionId} = ${input.session_id}
      AND ${ctaClicks.ctaLabel} = ${input.cta_label}
      AND ${ctaClicks.lpSlug} IS NOT DISTINCT FROM ${input.lp_slug}::text
      AND ${ctaClicks.occurredAt} > now() - ${sql.raw(
        `interval '${DEDUPE_WINDOW_SECONDS} seconds'`
      )}
  )`;
}

export async function recordCtaClick(
  input: CtaEventInput,
  context: CtaEventContext
): Promise<void> {
  await db.insert(ctaClicks).values({
    pagePath: input.page_path,
    lpSlug: input.lp_slug,
    // Diturunkan server, tidak dipercayakan ke client.
    pageType: input.lp_slug ? "lp" : "site",
    ctaLabel: input.cta_label,
    utmSource: input.utm_source,
    utmMedium: input.utm_medium,
    utmCampaign: input.utm_campaign,
    utmContent: input.utm_content,
    utmTerm: input.utm_term,
    referrer: input.referrer,
    userAgent: context.userAgent,
    deviceType: deviceTypeFromUserAgent(context.userAgent),
    ipHash: context.ipHash,
    sessionId: input.session_id,
    clientTimestamp: input.client_timestamp,
    isDuplicate: duplicateFlag(input),
  });
}
