import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import {
  formatArticleDate,
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/content/articles";
import { siteConfig } from "@/lib/content/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Tidak Ditemukan" };

  return {
    title: article.seoTitle ?? `${article.title} — ${siteConfig.name}`,
    description: article.seoDescription ?? article.excerpt,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
      url: `${siteConfig.url}/artikel/${article.slug}`,
      siteName: siteConfig.name,
      locale: "id_ID",
      type: "article",
    },
  };
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        compact
        title={article.title}
        description={`${article.category} · ${formatArticleDate(article.publishedAt)}`}
        crumbs={[
          { href: "/", label: "Beranda" },
          { href: "/artikel", label: "Artikel" },
          { label: article.title },
        ]}
      />

      <section className="py-14 md:py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary mb-8 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Kembali ke daftar artikel
          </Link>

          <article
            className="prose prose-slate max-w-none
              prose-headings:font-heading prose-headings:text-primary
              prose-h2:text-2xl prose-h2:font-semibold
              prose-p:text-text-muted prose-p:leading-relaxed
              prose-ul:text-text-muted prose-ol:text-text-muted
              prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-10 p-5 ls-soft-panel rounded-xl text-sm text-text-muted leading-relaxed">
            <strong className="font-semibold text-text">Catatan:</strong> Artikel
            ini bersifat edukatif dan umum. Bukan nasihat hukum untuk kasus
            spesifik Anda.
          </div>

          <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <p className="text-sm text-text-muted max-w-md">
              Punya pertanyaan terkait topik ini? Ceritakan situasinya kepada kami.
            </p>
            <WhatsappCta ctaLabel={`artikel_${article.slug}_wa`} className="text-sm px-5 py-2.5">
              Konsultasi via WhatsApp
            </WhatsappCta>
          </div>
        </div>
      </section>
    </>
  );
}
