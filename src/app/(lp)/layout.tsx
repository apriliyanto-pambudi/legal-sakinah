import type { Metadata } from "next";
import UtmTracker from "@/components/shared/UtmTracker";

/**
 * Layout landing page ads — TANPA header, TANPA footer navigasi.
 * Satu-satunya tujuan konversi: klik CTA WhatsApp.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UtmTracker />
      {children}
    </>
  );
}
