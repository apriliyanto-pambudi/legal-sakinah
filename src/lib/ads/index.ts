/**
 * Tracking iklan Landing Page saja (Meta / Google Ads / TikTok).
 * PageView saat load LP; Lead saat klik CTA WhatsApp (lpSlug terisi).
 */

export {
  hasAnyLpAdsId,
  sanitizeAdsId,
  sanitizeLpAdsIds,
  type LpAdsPixelIds,
} from "./types";

import { trackGoogleAdsLead } from "./google";
import { trackMetaLead } from "./meta";
import { trackTikTokLead } from "./tiktok";

/** Fire Lead ke semua pixel yang aktif di LP. Fire-and-forget. */
export function trackLpAdsLead(): void {
  try {
    const ids = typeof window !== "undefined" ? window.__LS_LP_ADS__ : undefined;
    if (!ids) return;

    if (ids.metaPixelId) trackMetaLead();
    if (ids.googleAdsId) trackGoogleAdsLead(ids.googleAdsId);
    if (ids.tiktokPixelId) trackTikTokLead();
  } catch {
    // Telemetri tidak boleh menghalangi WhatsApp.
  }
}
