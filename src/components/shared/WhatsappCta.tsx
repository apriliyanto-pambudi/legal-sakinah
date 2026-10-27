"use client";

/**
 * Komponen CTA WhatsApp — SATU komponen ini dipakai oleh semua CTA,
 * di landing page ads maupun di website utama (PRD Section 4, Alur klik CTA).
 *
 * Urutan saat diklik:
 *   (a) sendBeacon → POST /api/events/cta   [fire-and-forget]
 *   (b) event GA4 cta_whatsapp_click        [paralel, non-blocking]
 *   (c) navigasi default <a> ke wa.me       [tanpa await, tanpa preventDefault]
 */

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/content/site";
import { trackCtaClick } from "@/lib/cta-tracking";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useCtaScope } from "./CtaScope";

interface WhatsappCtaProps {
  /** Label unik per tombol: hero_wa | sticky_wa | footer_wa | faq_wa | dsb. */
  ctaLabel: string;
  /** Override nomor; default dari CtaScope, lalu dari env. */
  waNumber?: string;
  /** Override prefill; default dari CtaScope, lalu dari env. */
  prefill?: string;
  /** Override slug LP; default dari CtaScope (null di website utama). */
  lpSlug?: string | null;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Desktop dibuka di tab baru; di perangkat sentuh navigasi langsung agar
 * aplikasi WhatsApp mengambil alih (PRD Section 4, langkah 4).
 *
 * Nilai awal `true` menyamai render server sehingga tidak ada mismatch
 * hidrasi — penyesuaian terjadi setelah mount.
 */
function useOpenInNewTab(): boolean {
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    setOpenInNewTab(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return openInNewTab;
}

export default function WhatsappCta({
  ctaLabel,
  waNumber,
  prefill,
  lpSlug,
  children = "Konsultasi via WhatsApp",
  className = "",
}: WhatsappCtaProps) {
  const scope = useCtaScope();
  const openInNewTab = useOpenInNewTab();

  const number = waNumber ?? scope?.waNumber ?? siteConfig.waNumber;
  const text = prefill ?? scope?.prefill ?? siteConfig.waPrefill;
  const resolvedLpSlug = lpSlug ?? scope?.lpSlug ?? null;

  return (
    <a
      href={buildWhatsappUrl(number, text)}
      target={openInNewTab ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={() => trackCtaClick(ctaLabel, resolvedLpSlug)}
      className={`inline-flex items-center gap-2 min-h-11 bg-cta text-cta-foreground font-semibold rounded-md px-5 py-3 transition-colors duration-200 hover:bg-cta-hover cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta ${className}`}
    >
      {/* Glyph WhatsApp resmi — SVG, bukan emoji */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 shrink-0"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.556 4.116 1.528 5.845L.057 23.5l5.797-1.52A11.935 11.935 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.374l-.36-.213-3.44.902.92-3.352-.234-.375A9.818 9.818 0 1 1 12 21.818z" />
      </svg>
      {children}
    </a>
  );
}
