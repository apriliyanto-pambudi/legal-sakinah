import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LpBlocks from "@/components/lp/LpBlocks";
import LpFooter from "@/components/lp/LpFooter";
import { CtaScopeProvider } from "@/components/shared/CtaScope";
import {
  getPublicLandingPage,
  getPublicLandingPageSlugs,
  getPublicSiteConfig,
} from "@/lib/content/cms";

interface Props {
  params: Promise<{ lpSlug: string }>;
}

export async function generateStaticParams(): Promise<{ lpSlug: string }[]> {
  const slugs = await getPublicLandingPageSlugs();
  return slugs.map((lpSlug) => ({ lpSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lpSlug } = await params;
  const lp = await getPublicLandingPage(lpSlug);

  if (!lp) return { robots: { index: false, follow: false } };

  return {
    title: lp.headline,
    description: lp.subheadline ?? undefined,
    // LP ads selalu noindex, nofollow (PRD Section 6.2) dan tidak masuk sitemap.
    robots: { index: false, follow: false },
  };
}

export default async function LandingPage({ params }: Props) {
  const { lpSlug } = await params;
  const lp = await getPublicLandingPage(lpSlug);

  // LP tidak ada atau masih draft → 404 (PRD Section 4B, langkah 2).
  if (!lp) notFound();

  const site = await getPublicSiteConfig();

  return (
    <CtaScopeProvider
      lpSlug={lp.slug}
      waNumber={lp.whatsappNumberOverride ?? site.waNumber}
      prefill={lp.whatsappPrefill ?? site.waPrefill}
    >
      <main className="flex-1">
        <LpBlocks lp={lp} />
        <LpFooter />
      </main>
    </CtaScopeProvider>
  );
}
