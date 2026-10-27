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
import { getAllSettings } from "@/server/db/queries/site-settings";
import {
  getPublishedTeamFromDb,
  hasAnyTeamInDb,
  type TeamMemberRow,
} from "@/server/db/queries/team";
import { getPublishedFaqs, type FaqItem } from "./faq";
import {
  getPublishedLandingPage,
  getPublishedLandingPageSlugs,
  type LandingPageRecord,
} from "./landing-pages";
import { siteConfig } from "./site";
import {
  getPublishedServices,
  getServiceBySlug,
  type Service,
} from "./services";
import { getPublishedTeam, type TeamMember } from "./team";

export type PublicSiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  waNumber: string;
  waPrefill: string;
  address: string;
  email: string;
  officeHours: string;
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function mapService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    icon: row.icon ?? "Scale",
    summary: row.summary ?? "",
    content: row.content ?? "",
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    sortOrder: row.sortOrder,
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
  });

  return {
    name: settings.site_name || siteConfig.name,
    tagline: settings.site_tagline || siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    waNumber: settings.whatsapp_number_default || siteConfig.waNumber,
    waPrefill: settings.whatsapp_prefill_default || siteConfig.waPrefill,
    address: settings.office_address || siteConfig.address,
    email: settings.contact_email || siteConfig.email,
    officeHours: settings.office_hours || siteConfig.officeHours,
  };
}
