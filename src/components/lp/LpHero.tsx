import Image from "next/image";
import { CheckCircle } from "lucide-react";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { siteConfig } from "@/lib/content/site";

interface LpHeroProps {
  headline: string;
  subheadline: string | null;
  ctaText: string;
  badges: string[];
  supportingNote: string;
  heroImageUrl?: string | null;
}

/**
 * Hero LP ads.
 *
 * Logo ditampilkan sebagai teks biasa, bukan tautan ke beranda — LP tidak boleh
 * punya jalan keluar selain CTA WhatsApp (design-system/pages/landing-page-ads.md).
 * Jika `heroImageUrl` diisi, banner visual ditampilkan di atas (pola ads Prestige).
 */
export default function LpHero({
  headline,
  subheadline,
  ctaText,
  badges,
  supportingNote,
  heroImageUrl,
}: LpHeroProps) {
  return (
    <section className="ls-atmosphere overflow-hidden">
      {heroImageUrl ? (
        <div className="relative w-full aspect-[16/9] max-h-[420px] bg-primary/40">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : null}

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-20">
        <p className="font-heading text-xl font-semibold tracking-tight mb-1">
          {siteConfig.name}
        </p>
        <p className="ls-motto text-accent text-sm mb-10 md:mb-14">{siteConfig.motto}</p>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5">
          {headline}
        </h1>

        {subheadline && (
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
            {subheadline}
          </p>
        )}

        <WhatsappCta ctaLabel="hero_wa" className="text-base px-6 py-3.5 shadow-md">
          {ctaText}
        </WhatsappCta>

        {supportingNote ? (
          <p className="text-white/60 text-sm mt-4">{supportingNote}</p>
        ) : null}

        {badges.length > 0 ? (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-8 pt-6 border-t border-white/15">
            {badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-sm text-white/75">
                <CheckCircle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                {badge}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
