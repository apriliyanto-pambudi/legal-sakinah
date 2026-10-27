import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/content/articles";
import { getPublicServices, getPublicSiteConfig } from "@/lib/content/cms";

/**
 * sitemap.ts — halaman publik website utama saja.
 * LP ads dikecualikan sesuai PRD (noindex, tidak boleh masuk sitemap).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getPublicSiteConfig();
  const services = await getPublicServices();
  const articles = getPublishedArticles();
  const baseUrl = site.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/layanan`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tim`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/artikel`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/kebijakan-privasi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/layanan/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...servicePages, ...articlePages];
}
