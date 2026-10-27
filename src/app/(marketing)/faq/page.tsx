import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicFaqs } from "@/lib/content/cms";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `FAQ — Pertanyaan yang Sering Diajukan | ${siteConfig.name}`,
  description:
    "Jawaban atas pertanyaan umum tentang proses perceraian, hak asuh anak, nafkah, harta bersama, isbat nikah, dan layanan hukum keluarga lainnya.",
  openGraph: {
    title: `FAQ — ${siteConfig.name}`,
    description: "Pertanyaan umum seputar hukum keluarga.",
    url: `${siteConfig.url}/faq`,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

const categoryLabels: Record<string, string> = {
  umum: "Umum",
  perceraian: "Perceraian",
  "hak-asuh": "Hak Asuh Anak",
  harta: "Harta Bersama",
  nafkah: "Nafkah",
  "isbat-nikah": "Isbat Nikah",
};

export default async function FaqPage() {
  const faqs = await getPublicFaqs();

  // Kelompokkan per kategori
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  // JSON-LD FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title="Pertanyaan yang Sering Diajukan"
        description="Jawaban atas pertanyaan yang paling sering muncul. Jika belum terjawab di sini, hubungi kami langsung."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "FAQ" },
        ]}
      />

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {categories.map((cat) => (
            <div key={cat} className="mb-10">
              <h2 className="font-heading text-xl font-semibold text-primary mb-4 pb-2 border-b border-border">
                {categoryLabels[cat] ?? cat}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[cat].map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-surface rounded-xl border border-border overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-text hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                      <span>{faq.question}</span>
                      <ChevronRight
                        className="w-4 h-4 shrink-0 text-text-muted group-open:rotate-90 transition-transform duration-200"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-5 pb-5 pt-4 text-sm text-text-muted leading-relaxed border-t border-border">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <div className="mt-6 p-5 bg-muted rounded-xl border border-border text-sm text-text-muted leading-relaxed">
            <strong className="font-semibold text-text">Catatan penting:</strong> Jawaban di atas bersifat umum dan informatif. Setiap situasi hukum memiliki keunikannya sendiri. Informasi ini tidak dapat menggantikan konsultasi langsung dengan advokat.
          </div>
        </div>
      </section>

      <section className="ls-atmosphere py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="ls-motto text-accent text-base mb-3">{siteConfig.motto}</p>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3 text-white">
            Pertanyaan Anda tidak ada di sini?
          </h2>
          <p className="text-white/75 mb-6 max-w-lg mx-auto">
            Ceritakan situasi spesifik Anda. Konsultasi awal tersedia melalui WhatsApp.
          </p>
          <WhatsappCta ctaLabel="faq_cta_wa">
            Tanyakan Langsung via WhatsApp
          </WhatsappCta>
        </div>
      </section>
    </>
  );
}
