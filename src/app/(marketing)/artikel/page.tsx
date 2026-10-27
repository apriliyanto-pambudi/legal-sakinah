import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import {
  formatArticleDate,
  getPublishedArticles,
} from "@/lib/content/articles";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `Artikel Edukasi Hukum Keluarga — ${siteConfig.name}`,
  description:
    "Artikel edukasi seputar perceraian, hak asuh, isbat nikah, dan hukum keluarga. Informasi umum — bukan nasihat hukum individual.",
  openGraph: {
    title: `Artikel — ${siteConfig.name}`,
    description: "Edukasi hukum keluarga dari Legal Sakinah.",
    url: `${siteConfig.url}/artikel`,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

export default function ArtikelListPage() {
  const list = getPublishedArticles();

  return (
    <>
      <PageHero
        title="Artikel Edukasi"
        description="Penjelasan umum seputar hukum keluarga. Bukan nasihat hukum individual — konsultasikan situasi Anda dengan advokat."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Artikel" },
        ]}
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ul className="flex flex-col gap-0 divide-y divide-border">
            {list.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/artikel/${article.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-7 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  <time
                    dateTime={article.publishedAt}
                    className="text-xs text-text-muted shrink-0 sm:w-36"
                  >
                    {formatArticleDate(article.publishedAt)}
                  </time>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">
                      {article.category}
                    </p>
                    <h2 className="font-heading text-xl md:text-2xl font-semibold text-primary group-hover:text-secondary transition-colors duration-200 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
                      {article.excerpt}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent shrink-0 group-hover:gap-2 transition-all duration-200">
                    Baca
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
