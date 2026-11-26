import Script from "next/script";
import {
  getGoogleAdsConfigScript,
  getGoogleAdsScriptSrc,
} from "@/lib/ads/google";
import {
  hasAnyLpAdsId,
  sanitizeLpAdsIds,
} from "@/lib/ads";
import {
  getMetaPixelBootstrapScript,
  getMetaPixelNoscriptSrc,
} from "@/lib/ads/meta";
import { getTikTokPixelBootstrapScript } from "@/lib/ads/tiktok";

type Props = {
  metaPixelId: string;
  googleAdsId: string;
  tiktokPixelId: string;
};

/**
 * Inject Meta / Google Ads / TikTok hanya di route group LP.
 * PageView saat script load; Lead di-fire dari trackCtaClick saat lpSlug ada.
 */
export default function LpAdsPixels({
  metaPixelId,
  googleAdsId,
  tiktokPixelId,
}: Props) {
  const ids = sanitizeLpAdsIds({ metaPixelId, googleAdsId, tiktokPixelId });

  if (!hasAnyLpAdsId(ids)) return null;

  return (
    <>
      <Script id="ls-lp-ads-ids" strategy="afterInteractive">
        {`window.__LS_LP_ADS__=${JSON.stringify(ids)};`}
      </Script>

      {ids.metaPixelId ? (
        <>
          <Script id="ls-meta-pixel" strategy="afterInteractive">
            {getMetaPixelBootstrapScript(ids.metaPixelId)}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={getMetaPixelNoscriptSrc(ids.metaPixelId)}
              alt=""
            />
          </noscript>
        </>
      ) : null}

      {ids.googleAdsId ? (
        <>
          <Script
            id="ls-google-ads-src"
            src={getGoogleAdsScriptSrc(ids.googleAdsId)}
            strategy="afterInteractive"
          />
          <Script id="ls-google-ads-config" strategy="afterInteractive">
            {getGoogleAdsConfigScript(ids.googleAdsId)}
          </Script>
        </>
      ) : null}

      {ids.tiktokPixelId ? (
        <Script id="ls-tiktok-pixel" strategy="afterInteractive">
          {getTikTokPixelBootstrapScript(ids.tiktokPixelId)}
        </Script>
      ) : null}
    </>
  );
}
