"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";

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

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  for (const key of SETTING_KEYS) {
    const value = (formData.get(key) as string) ?? "";
    await db
      .insert(schema.siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  revalidateCmsTag(CACHE_TAGS.siteSettings);
  revalidatePath("/", "layout");
  revalidatePath("/admin/pengaturan");
  redirect("/admin/pengaturan?saved=1");
}
