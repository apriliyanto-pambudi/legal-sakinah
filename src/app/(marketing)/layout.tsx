import type { Metadata } from "next";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import { CtaScopeProvider } from "@/components/shared/CtaScope";
import UtmTracker from "@/components/shared/UtmTracker";
import { getPublicSiteConfig } from "@/lib/content/cms";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getPublicSiteConfig();

  return (
    <CtaScopeProvider lpSlug={null} waNumber={site.waNumber} prefill={site.waPrefill}>
      <UtmTracker />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Langsung ke konten utama
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter site={site} />
    </CtaScopeProvider>
  );
}
