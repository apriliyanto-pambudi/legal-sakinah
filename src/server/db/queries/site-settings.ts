import { db, schema } from "@/server/db";
import { eq } from "drizzle-orm";

export type SiteSettingRow = typeof schema.siteSettings.$inferSelect;

const SETTING_KEYS = [
  "whatsapp_number_default",
  "whatsapp_prefill_default",
  "ga4_measurement_id",
  "meta_pixel_id",
  "office_address",
  "office_hours",
  "contact_email",
  "site_name",
  "site_tagline",
  "site_motto",
  "site_description",
  "instagram_url",
  "facebook_url",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

export interface SiteSettingsMap {
  whatsapp_number_default: string;
  whatsapp_prefill_default: string;
  ga4_measurement_id: string;
  meta_pixel_id: string;
  office_address: string;
  office_hours: string;
  contact_email: string;
  site_name: string;
  site_tagline: string;
  site_motto: string;
  site_description: string;
  instagram_url: string;
  facebook_url: string;
}

export interface HomeHeroSettings {
  hero_headline: string;
  hero_description: string;
  hero_supporting_text: string;
  hero_cta_text: string;
  hero_photo_url: string;
  mid_cta_photo_url: string;
}

export async function getAllSettings(): Promise<SiteSettingsMap> {
  const rows = await db.select().from(schema.siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return {
    whatsapp_number_default: map["whatsapp_number_default"] ?? "",
    whatsapp_prefill_default: map["whatsapp_prefill_default"] ?? "",
    ga4_measurement_id: map["ga4_measurement_id"] ?? "",
    meta_pixel_id: map["meta_pixel_id"] ?? "",
    office_address: map["office_address"] ?? "",
    office_hours: map["office_hours"] ?? "",
    contact_email: map["contact_email"] ?? "",
    site_name: map["site_name"] ?? "Legal Sakinah",
    site_tagline: map["site_tagline"] ?? "",
    site_motto: map["site_motto"] ?? "",
    site_description: map["site_description"] ?? "",
    instagram_url: map["instagram_url"] ?? "",
    facebook_url: map["facebook_url"] ?? "",
  };
}

export async function getSetting(key: SettingKey): Promise<string> {
  const rows = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, key))
    .limit(1);
  return rows[0]?.value ?? "";
}

export interface KontakSettings {
  bannerDesc: string;
}

export async function getKontakSettings(): Promise<KontakSettings> {
  const rows = await db.select().from(schema.siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value ?? "";
  return { bannerDesc: map["kontak_banner_desc"] ?? "" };
}

export interface TentangSettings {
  bannerDesc: string;
  practiceAreas: string; // 1 baris = 1 poin
  nilaiText: string;    // blok: Judul\nDeskripsi\n\nJudul\nDeskripsi
}

export async function getTentangSettings(): Promise<TentangSettings> {
  const rows = await db.select().from(schema.siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value ?? "";
  return {
    bannerDesc: map["tentang_banner_desc"] ?? "",
    practiceAreas: map["tentang_practice_areas"] ?? "",
    nilaiText: map["tentang_nilai_text"] ?? "",
  };
}

export async function getHomeHeroSettings(): Promise<HomeHeroSettings> {
  const keys = [
    "hero_headline",
    "hero_description",
    "hero_supporting_text",
    "hero_cta_text",
    "hero_photo_url",
    "mid_cta_photo_url",
  ];
  const rows = await db.select().from(schema.siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    if (keys.includes(row.key)) map[row.key] = row.value ?? "";
  }
  return {
    hero_headline: map["hero_headline"] ?? "",
    hero_description: map["hero_description"] ?? "",
    hero_supporting_text: map["hero_supporting_text"] ?? "",
    hero_cta_text: map["hero_cta_text"] ?? "",
    hero_photo_url: map["hero_photo_url"] ?? "",
    mid_cta_photo_url: map["mid_cta_photo_url"] ?? "",
  };
}
