import Image from "next/image";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { siteConfig } from "@/lib/content/site";

interface LpHeroProps {
  headline: string;
  subheadline: string | null;
  ctaText: string;
  heroImageUrl?: string | null;
}

/**
 * Hero LP ads — dua mode:
 *
 * 1. VISUAL (heroImageUrl diisi): gambar full-width tanpa crop + strip CTA di bawah.
 *    Headline/subheadline tidak ditampilkan HTML karena sudah baked di gambar.
 *
 * 2. TEKS (tanpa heroImageUrl): atmosphere background dengan teks penuh.
 *
 * shortcut: badge/supportingNote disembunyikan — unhide di UI + admin kalau trust signal dibutuhkan lagi.
 */
export default function LpHero({
  ctaText,
  heroImageUrl,
  headline,
  subheadline,
}: LpHeroProps) {
  /* ── Mode visual (ada banner) ─────────────────────────────────────── */
  if (heroImageUrl) {
    return (
      <section>
        {/* Gambar full-width, tidak di-crop — natural height */}
        <div className="max-w-[480px] mx-auto">
          <Image
            src={heroImageUrl}
            alt=""
            width={900}
            height={900}
            priority
            className="w-full h-auto block"
            sizes="(max-width: 480px) 100vw, 480px"
          />
        </div>

        {/* Strip CTA — tombol saja */}
        <div className="bg-primary text-white py-8 px-4">
          <div className="max-w-[480px] mx-auto text-center">
            <WhatsappCta ctaLabel="hero_wa" className="text-base px-6 py-3.5 shadow-md w-full justify-center sm:w-auto">
              {ctaText}
            </WhatsappCta>
          </div>
        </div>
      </section>
    );
  }

  /* ── Mode teks (tanpa banner) ─────────────────────────────────────── */
  return (
    <section className="ls-atmosphere overflow-hidden">
      <div className="relative max-w-[480px] mx-auto px-4 pt-8 pb-14 md:pt-12 md:pb-20">
        <p className="font-heading text-xl font-semibold tracking-tight mb-1 text-white">
          {siteConfig.name}
        </p>
        <p className="ls-motto text-accent text-sm mb-10 md:mb-14">{siteConfig.motto}</p>

        <h1 className="font-heading text-3xl sm:text-4xl font-semibold leading-tight mb-5">
          {headline}
        </h1>

        {subheadline && (
          <p className="text-white/80 text-base leading-relaxed mb-8">{subheadline}</p>
        )}

        <WhatsappCta ctaLabel="hero_wa" className="text-base px-6 py-3.5 shadow-md">
          {ctaText}
        </WhatsappCta>
      </div>
    </section>
  );
}
