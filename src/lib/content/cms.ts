/**
 * Resolver konten publik — utamakan baris CMS yang published,
 * fallback ke dummy statis bila tabel masih kosong.
 */

import {
  getPublishedFaqsFromDb,
  hasAnyFaqsInDb,
  type FaqRow,
} from "@/server/db/queries/faqs";
import {
  getLandingPageWithBlocksFromDb,
  getPublishedLandingPageSlugsFromDb,
  hasAnyLandingPagesInDb,
} from "@/server/db/queries/landing-pages";
import { getPublishedPageBySlug, type PageRow } from "@/server/db/queries/pages";
import {
  getPublishedServicesFromDb,
  getServiceBySlugFromDb,
  hasAnyServicesInDb,
  type ServiceRow,
} from "@/server/db/queries/services";
import {
  getAllSettings,
  getHomeHeroSettings,
} from "@/server/db/queries/site-settings";
import {
  getPublishedTeamFromDb,
  hasAnyTeamInDb,
  type TeamMemberRow,
} from "@/server/db/queries/team";
import {
  getPublishedTestimonialsFromDb,
  hasAnyTestimonialsInDb,
  type TestimonialRow,
} from "@/server/db/queries/testimonials";
import {
  getPublishedArticlesFromDb,
  getArticleBySlugFromDb,
  hasAnyArticlesInDb,
  type ArticleRow,
} from "@/server/db/queries/articles";
import { getPublishedFaqs, type FaqItem } from "./faq";
import {
  getPublishedArticles,
  getArticleBySlug,
  type Article,
} from "./articles";
import {
  getPublishedLandingPage,
  getPublishedLandingPageSlugs,
  type LandingPageRecord,
} from "./landing-pages";
import { siteConfig } from "./site";
import {
  getPublishedServices,
  getServiceBySlug,
  getServiceCatalogMeta,
  type Service,
} from "./services";
import { getPublishedTeam, parsePhotoFocus, type TeamMember } from "./team";
import { getTestimonials, type Testimonial } from "./testimonials";

export type PublicSiteConfig = {
  name: string;
  tagline: string;
  motto: string;
  description: string;
  url: string;
  waNumber: string;
  waPrefill: string;
  address: string;
  email: string;
  officeHours: string;
  instagramUrl: string;
  facebookUrl: string;
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function mapService(row: ServiceRow): Service {
  const meta = getServiceCatalogMeta(row.slug);
  return {
    slug: row.slug,
    title: row.title,
    icon: row.icon ?? "Scale",
    summary: row.summary ?? "",
    content: row.content ?? "",
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    sortOrder: row.sortOrder,
    category: meta?.category ?? "litigasi",
    priceLabel: meta?.priceLabel ?? null,
  };
}

function mapFaq(row: FaqRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category ?? "umum",
    sortOrder: row.sortOrder,
  };
}

function mapTeam(row: TeamMemberRow): TeamMember {
  return {
    slug: row.id,
    name: row.name,
    roleTitle: row.roleTitle ?? "",
    photoUrl: row.photoUrl ?? undefined,
    photoFocus: parsePhotoFocus(row.photoFocus),
    bio: row.bio ?? "",
    expertise: row.expertise ?? [],
    sortOrder: row.sortOrder,
  };
}

export async function getPublicServices(): Promise<Service[]> {
  const rows = await safe(getPublishedServicesFromDb, []);
  if (rows.length > 0) return rows.map(mapService);
  if (await safe(hasAnyServicesInDb, false)) return [];
  return getPublishedServices();
}

export async function getPublicServiceBySlug(slug: string): Promise<Service | null> {
  const row = await safe(() => getServiceBySlugFromDb(slug), null);
  if (row) return mapService(row);
  if (await safe(hasAnyServicesInDb, false)) return null;
  return getServiceBySlug(slug) ?? null;
}

export async function getPublicFaqs(): Promise<FaqItem[]> {
  const rows = await safe(getPublishedFaqsFromDb, []);
  if (rows.length > 0) return rows.map(mapFaq);
  if (await safe(hasAnyFaqsInDb, false)) return [];
  return getPublishedFaqs();
}

export async function getPublicTeam(): Promise<TeamMember[]> {
  const rows = await safe(getPublishedTeamFromDb, []);
  if (rows.length > 0) return rows.map(mapTeam);
  if (await safe(hasAnyTeamInDb, false)) return [];
  return getPublishedTeam();
}

function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    attribution: row.attribution,
    serviceSlug: row.serviceSlug ?? undefined,
  };
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  const rows = await safe(getPublishedTestimonialsFromDb, []);
  if (rows.length > 0) return rows.map(mapTestimonial);
  if (await safe(hasAnyTestimonialsInDb, false)) return [];
  return getTestimonials();
}

function mapArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    category: "",
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
  };
}

export async function getPublicArticles(): Promise<Article[]> {
  const rows = await safe(getPublishedArticlesFromDb, []);
  if (rows.length > 0) return rows.map(mapArticle);
  if (await safe(hasAnyArticlesInDb, false)) return [];
  return getPublishedArticles();
}

export async function getPublicArticleBySlug(
  slug: string
): Promise<Article | null> {
  const row = await safe(() => getArticleBySlugFromDb(slug), null);
  if (row) return mapArticle(row);
  if (await safe(hasAnyArticlesInDb, false)) return null;
  return getArticleBySlug(slug) ?? null;
}

export async function getPublicLandingPage(
  slug: string
): Promise<LandingPageRecord | null> {
  const fromDb = await safe(() => getLandingPageWithBlocksFromDb(slug), null);
  if (fromDb) return fromDb;
  if (await safe(hasAnyLandingPagesInDb, false)) return null;
  return getPublishedLandingPage(slug);
}

export async function getPublicLandingPageSlugs(): Promise<string[]> {
  const fromDb = await safe(getPublishedLandingPageSlugsFromDb, []);
  if (fromDb.length > 0) return fromDb;
  if (await safe(hasAnyLandingPagesInDb, false)) return [];
  return getPublishedLandingPageSlugs();
}

export async function getPublicPage(slug: string): Promise<PageRow | null> {
  return safe(() => getPublishedPageBySlug(slug), null);
}

export interface HomeHero {
  headline: string;
  description: string;
  supportingText: string;
  ctaText: string;
  photoUrl: string | null;
  midCtaPhotoUrl: string | null;
}

const HOME_HERO_DEFAULTS: HomeHero = {
  headline:
    "Pendampingan hukum keluarga yang tenang, jujur, dan dapat dipercaya.",
  description:
    "Spesialis perkara perceraian, hak asuh anak, harta bersama, isbat nikah, waris, dan perlindungan hukum keluarga — didampingi dengan kepekaan terhadap situasi yang sensitif.",
  supportingText:
    "Langkah pertama adalah percakapan. Tanpa tekanan, tanpa komitmen.",
  ctaText: "Konsultasi via WhatsApp",
  photoUrl: null,
  midCtaPhotoUrl: null,
};

export async function getPublicHomeHero(): Promise<HomeHero> {
  const s = await safe(getHomeHeroSettings, {
    hero_headline: "",
    hero_description: "",
    hero_supporting_text: "",
    hero_cta_text: "",
    hero_photo_url: "",
    mid_cta_photo_url: "",
  });
  return {
    headline: s.hero_headline || HOME_HERO_DEFAULTS.headline,
    description: s.hero_description || HOME_HERO_DEFAULTS.description,
    supportingText:
      s.hero_supporting_text || HOME_HERO_DEFAULTS.supportingText,
    ctaText: s.hero_cta_text || HOME_HERO_DEFAULTS.ctaText,
    photoUrl: s.hero_photo_url || null,
    midCtaPhotoUrl: s.mid_cta_photo_url || null,
  };
}

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  const settings = await safe(getAllSettings, {
    whatsapp_number_default: "",
    whatsapp_prefill_default: "",
    ga4_measurement_id: "",
    meta_pixel_id: "",
    office_address: "",
    office_hours: "",
    contact_email: "",
    site_name: "",
    site_tagline: "",
    site_motto: "",
    site_description: "",
    instagram_url: "",
    facebook_url: "",
  });

  return {
    name: settings.site_name || siteConfig.name,
    tagline: settings.site_tagline || siteConfig.tagline,
    motto: settings.site_motto || siteConfig.motto,
    description: settings.site_description || siteConfig.description,
    url: siteConfig.url,
    waNumber: settings.whatsapp_number_default || siteConfig.waNumber,
    waPrefill: settings.whatsapp_prefill_default || siteConfig.waPrefill,
    address: settings.office_address || siteConfig.address,
    email: settings.contact_email || siteConfig.email,
    officeHours: settings.office_hours || siteConfig.officeHours,
    instagramUrl: settings.instagram_url || siteConfig.socialLinks.instagram,
    facebookUrl: settings.facebook_url || siteConfig.socialLinks.facebook,
  };
}
