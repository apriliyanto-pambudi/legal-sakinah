import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  Heart,
  Landmark,
  FileText,
  Users,
  Shield,
  ChevronRight,
} from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicServices } from "@/lib/content/cms";
import { displayServicePrice } from "@/lib/content/services";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `Layanan Hukum Keluarga — ${siteConfig.name}`,
  description:
    "Layanan hukum keluarga Legal Sakinah: perceraian, hak asuh anak, nafkah & harta bersama, isbat nikah, waris, dan perlindungan KDRT.",
  openGraph: {
    title: `Layanan Hukum Keluarga — ${siteConfig.name}`,
    description: "Layanan hukum keluarga: perceraian, hak asuh, nafkah, isbat nikah, waris, dan KDRT.",
    url: `${siteConfig.url}/layanan`,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, Landmark, FileText, Users, Shield,
};

export default async function LayananPage() {
  const services = await getPublicServices();

  return (
    <>
      <PageHero
        title="Layanan Hukum Keluarga"
        description="Kami berfokus pada area hukum keluarga yang paling sering dibutuhkan, dengan pendekatan yang menyeluruh dan penuh empati."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Layanan" },
        ]}
      />

      {/* Daftar layanan */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
          {(
            [
              {
                key: "litigasi",
                title: "Layanan litigasi",
                desc: "Pendampingan perkara di pengadilan.",
              },
              {
                key: "non-litigasi",
                title: "Jasa non-litigasi",
                desc: "Penyusunan dokumen dan fasilitasi di luar pengadilan.",
              },
            ] as const
          ).map((group) => {
            const items = services.filter((s) => s.category === group.key);
            if (items.length === 0) return null;
            return (
              <div key={group.key}>
                <div className="max-w-2xl mb-6">
                  <p className="ls-motto text-accent text-sm mb-2">{group.title}</p>
                  <div className="ls-rule mb-3" aria-hidden="true" />
                  <p className="text-sm text-text-muted">{group.desc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((service) => {
                    const Icon = iconMap[service.icon] ?? Scale;
                    return (
                      <Link
                        key={service.slug}
                        href={`/layanan/${service.slug}`}
                        className="group flex gap-5 items-start ls-soft-panel rounded-xl p-6 hover:border-accent/40 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors duration-200">
                          <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-heading text-lg font-semibold text-primary mb-2">
                            {service.title}
                          </h2>
                          <p className="text-sm font-semibold text-accent mb-2">
                            {displayServicePrice(service)}
                          </p>
                          <p className="text-sm text-text-muted leading-relaxed mb-3">
                            {service.summary}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-cta group-hover:gap-2 transition-all duration-200">
                            Pelajari lebih lanjut
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
            Biaya bersifat indikatif &ldquo;mulai dari&rdquo;. Nilai akhir menyesuaikan kompleksitas
            perkara, lingkup pendampingan, dan kesepakatan setelah konsultasi.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="p-4 bg-muted rounded-xl border border-border text-sm text-text-muted">
          <strong className="font-semibold text-text">Catatan:</strong> Informasi di halaman ini bersifat umum dan tidak merupakan nasihat hukum. Setiap perkara memiliki keunikannya sendiri. Konsultasikan situasi Anda langsung dengan advokat kami.
        </div>
      </div>

      <section className="ls-atmosphere py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="ls-motto text-accent text-base mb-3">{siteConfig.motto}</p>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3 text-white">
            Tidak yakin layanan mana yang tepat?
          </h2>
          <p className="text-white/75 mb-6 max-w-lg mx-auto">
            Ceritakan situasinya. Kami bantu arahkan ke layanan yang paling relevan.
          </p>
          <WhatsappCta ctaLabel="layanan_list_cta_wa">
            Konsultasi via WhatsApp
          </WhatsappCta>
        </div>
      </section>
    </>
  );
}
