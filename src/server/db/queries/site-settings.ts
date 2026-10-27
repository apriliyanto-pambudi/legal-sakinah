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
