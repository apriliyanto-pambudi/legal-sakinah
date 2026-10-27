import WhatsappCta from "@/components/shared/WhatsappCta";

interface LpStickyCtaProps {
  ctaText: string;
}

/**
 * Sticky CTA khusus mobile (design-system/pages/landing-page-ads.md).
 *
 * Tinggi total ~72–88px termasuk safe-area iOS; pembungkus konten LP memberi
 * padding bawah sebesar itu agar tidak ada teks yang tertutup.
 */
export default function LpStickyCta({ ctaText }: LpStickyCtaProps) {
  return (
    <div
      role="region"
      aria-label="Tombol konsultasi cepat"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-sm shadow-lg px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <WhatsappCta
        ctaLabel="sticky_wa"
        className="w-full justify-center text-base px-5 py-3"
      >
        {ctaText}
      </WhatsappCta>
    </div>
  );
}
