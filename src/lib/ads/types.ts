export type LpAdsPixelIds = {
  metaPixelId: string;
  googleAdsId: string;
  tiktokPixelId: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __LS_LP_ADS__?: LpAdsPixelIds;
  }
}

/** Hanya izinkan karakter aman untuk ID pixel/tag (slash = opsional label Google Ads). */
export function sanitizeAdsId(raw: string): string {
  return raw.trim().replace(/[^a-zA-Z0-9_/-]/g, "");
}

export function hasAnyLpAdsId(ids: LpAdsPixelIds): boolean {
  return Boolean(ids.metaPixelId || ids.googleAdsId || ids.tiktokPixelId);
}

export function sanitizeLpAdsIds(raw: {
  metaPixelId: string;
  googleAdsId: string;
  tiktokPixelId: string;
}): LpAdsPixelIds {
  return {
    metaPixelId: sanitizeAdsId(raw.metaPixelId),
    googleAdsId: sanitizeAdsId(raw.googleAdsId),
    tiktokPixelId: sanitizeAdsId(raw.tiktokPixelId),
  };
}
