import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Heart,
  Landmark,
  FileText,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicServiceBySlug, getPublicServices } from "@/lib/content/cms";
import { siteConfig } from "@/lib/content/site";

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Heart,
  Landmark,
  FileText,
  Users,
  Shield,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);
  if (!service) return { title: "Tidak Ditemukan" };

  return {
    title: service.seoTitle ?? `${service.title} — ${siteConfig.name}`,
    description:
      service.seoDescription ??
      `${service.summary} Hubungi Legal Sakinah untuk konsultasi.`,
    openGraph: {
      title: service.seoTitle ?? service.title,
      description: service.seoDescription ?? service.summary,
      url: `${siteConfig.url}/layanan/${service.slug}`,
      siteName: siteConfig.name,
      locale: "id_ID",
      type: "website",
    },
  };
}

export default async function LayananDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);
  if (!service) notFound();

  const allServices = await getPublicServices();
  const otherServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Layanan", item: `${siteConfig.url}/layanan` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${siteConfig.url}/layanan/${service.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <PageHero
        title={service.title}
        description={service.summary}
        crumbs={[
          { href: "/", label: "Beranda" },
          { href: "/layanan", label: "Layanan" },
          { label: service.title },
        ]}
      />

      {/* Konten utama */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Konten artikel */}
            <article className="lg:col-span-2">
              <p className="text-base font-semibold text-accent mb-6">
                {siteConfig.startingPriceLabel}
              </p>
              <p className="text-xs text-text-muted mb-8 leading-relaxed">
                Biaya bersifat indikatif &ldquo;mulai dari&rdquo;. Nilai akhir menyesuaikan
                kompleksitas perkara, lingkup pendampingan, dan kesepakatan setelah konsultasi.
              </p>
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-heading prose-headings:text-primary
                  prose-h3:text-xl prose-h3:font-semibold
                  prose-p:text-text-muted prose-p:leading-relaxed
                  prose-ul:text-text-muted prose-li:leading-relaxed
                  prose-strong:text-text
                  [&_.disclaimer]:text-xs [&_.disclaimer]:text-text-muted [&_.disclaimer]:border-l-2 [&_.disclaimer]:border-border [&_.disclaimer]:pl-3 [&_.disclaimer]:py-2 [&_.disclaimer]:bg-muted [&_.disclaimer]:rounded-r-md"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />

              <div className="mt-8 pt-8 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  Semua Layanan
                </Link>
                <WhatsappCta
                  ctaLabel={`layanan_${service.slug}_wa`}
                  className="text-sm px-4 py-2.5"
                >
                  Konsultasi Layanan Ini
                </WhatsappCta>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              {/* CTA sidebar */}
              <div className="ls-atmosphere rounded-xl p-6 mb-6">
                <h2 className="font-heading text-lg font-semibold mb-2 text-white">
                  Butuh Bantuan?
                </h2>
                <p className="text-sm text-white/75 mb-4 leading-relaxed">
                  Konsultasikan situasi Anda langsung dengan tim advokat kami. Tanpa komitmen, tanpa tekanan.
                </p>
                <WhatsappCta
                  ctaLabel={`sidebar_${service.slug}_wa`}
                  className="text-sm w-full justify-center px-4 py-2.5"
                >
                  Hubungi via WhatsApp
                </WhatsappCta>
              </div>

              {/* Layanan lain */}
              {otherServices.length > 0 && (
                <div className="bg-surface rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-text mb-4 text-sm">Layanan Lainnya</h3>
                  <ul className="flex flex-col gap-2">
                    {otherServices.map((s) => {
                      const OtherIcon = iconMap[s.icon] ?? Scale;
                      return (
                        <li key={s.slug}>
                          <Link
                            href={`/layanan/${s.slug}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group"
                          >
                            <OtherIcon className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                            <span className="text-sm text-text group-hover:text-primary transition-colors duration-200">
                              {s.title}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-text-muted ml-auto shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
