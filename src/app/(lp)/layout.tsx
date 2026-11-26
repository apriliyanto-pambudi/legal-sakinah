import type { Metadata } from "next";
import LpAdsPixels from "@/components/lp/LpAdsPixels";
import UtmTracker from "@/components/shared/UtmTracker";
import { getAllSettings } from "@/server/db/queries/site-settings";

/**
 * Layout landing page ads — TANPA header, TANPA footer navigasi.
 * Satu-satunya tujuan konversi: klik CTA WhatsApp.
 * Pixel Meta / Google Ads / TikTok hanya di sini (PageView + Lead).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let metaPixelId = "";
  let googleAdsId = "";
  let tiktokPixelId = "";

  try {
    const settings = await getAllSettings();
    metaPixelId = settings.meta_pixel_id;
    googleAdsId = settings.google_ads_id;
    tiktokPixelId = settings.tiktok_pixel_id;
  } catch {
    // Settings gagal → LP tetap render tanpa pixel.
  }

  return (
    <>
      <UtmTracker />
      <LpAdsPixels
        metaPixelId={metaPixelId}
        googleAdsId={googleAdsId}
        tiktokPixelId={tiktokPixelId}
      />
      {children}
    </>
  );
}
