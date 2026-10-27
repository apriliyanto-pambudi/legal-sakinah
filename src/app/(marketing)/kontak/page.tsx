import type { Metadata } from "next";
import { MapPin, Clock, Mail, MessageCircle } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import CmsHtml from "@/components/shared/CmsHtml";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicPage, getPublicSiteConfig } from "@/lib/content/cms";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([
    getPublicPage("kontak"),
    getPublicSiteConfig(),
  ]);

  return {
    title: page?.seoTitle || page?.title || `Kontak — ${site.name}`,
    description:
      page?.seoDescription ||
      "Hubungi Legal Sakinah untuk konsultasi hukum keluarga. Tersedia melalui WhatsApp atau email.",
    openGraph: {
      title: page?.seoTitle || page?.title || `Kontak — ${site.name}`,
      description:
        page?.seoDescription ||
        "Hubungi Legal Sakinah untuk konsultasi hukum keluarga.",
      url: `${site.url}/kontak`,
      siteName: site.name,
      locale: "id_ID",
      type: "website",
    },
  };
}

export default async function KontakPage() {
  const [page, site] = await Promise.all([
    getPublicPage("kontak"),
    getPublicSiteConfig(),
  ]);
  const cmsHtml = page?.content?.trim();

  const contactItems = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Klik tombol di bawah untuk membuka percakapan",
      detail: "Cara tercepat untuk menghubungi kami",
    },
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      detail: "Untuk pertanyaan yang tidak mendesak",
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      label: "Lokasi Kantor",
      value: site.address,
      detail: "Pertemuan tatap muka atas perjanjian",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: site.officeHours,
      detail: "Di luar jam operasional, hubungi via WhatsApp",
    },
  ];

  return (
    <>
      <PageHero
        title={page?.title || "Hubungi Kami"}
        description="Ceritakan situasi Anda. Langkah pertama adalah percakapan — tanpa tekanan, tanpa komitmen."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Kontak" },
        ]}
      />

      {cmsHtml ? <CmsHtml html={cmsHtml} /> : null}

      {/* Informasi kontak */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Kontak utama */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-8">
                Cara Menghubungi Kami
              </h2>

              <div className="flex flex-col gap-5 mb-8">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4 p-5 bg-surface rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium text-text hover:text-primary transition-colors duration-200 cursor-pointer"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-text">{item.value}</p>
                        )}
                        <p className="text-xs text-text-muted mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 bg-cta/8 rounded-xl border border-cta/20">
                <p className="text-sm font-semibold text-cta mb-1">Cara Terbaik: WhatsApp</p>
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  Respons tercepat tersedia melalui WhatsApp pada jam operasional. Ceritakan situasi Anda secara ringkas dan kami akan memandu langkah selanjutnya.
                </p>
                <WhatsappCta ctaLabel="kontak_utama_wa" className="text-sm px-4 py-2.5">
                  Buka WhatsApp Sekarang
                </WhatsappCta>
              </div>
            </div>

            {/* Panduan konsultasi */}
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h2 className="font-heading text-xl font-semibold text-primary mb-5">
                Panduan Konsultasi Pertama
              </h2>
              <ol className="flex flex-col gap-5">
                {[
                  {
                    step: "1",
                    title: "Hubungi melalui WhatsApp",
                    desc: "Kirimkan pesan singkat mengenai situasi Anda. Tidak perlu langsung detail — cukup gambaran umum.",
                  },
                  {
                    step: "2",
                    title: "Diskusi awal",
                    desc: "Tim kami akan merespons dan menanyakan informasi lebih lanjut untuk memahami konteks perkara Anda.",
                  },
                  {
                    step: "3",
                    title: "Gambaran umum proses",
                    desc: "Kami akan menjelaskan pilihan hukum yang tersedia, proses yang mungkin dilalui, dan hal-hal yang perlu dipersiapkan.",
                  },
                  {
                    step: "4",
                    title: "Keputusan ada di tangan Anda",
                    desc: "Tidak ada tekanan untuk melanjutkan. Anda bebas mengambil waktu untuk mempertimbangkan sebelum memutuskan.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-semibold text-text mb-1">{item.title}</p>
                      <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-5 border-t border-border text-xs text-text-muted italic">
                Kerahasiaan percakapan Anda dijaga sepenuhnya. Informasi yang Anda bagikan hanya digunakan untuk keperluan konsultasi.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
