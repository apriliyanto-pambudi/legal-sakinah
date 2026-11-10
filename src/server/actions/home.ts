"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { saveHomePhoto } from "@/lib/upload";

async function upsertSetting(key: string, value: string) {
  await db
    .insert(schema.siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function updateHomeHero(formData: FormData) {
  await requireAdmin();

  let photoUrl = (formData.get("hero_photo_url") as string) ?? "";
  const file = formData.get("hero_photo");
  if (file instanceof File && file.size > 0) {
    try {
      photoUrl = await saveHomePhoto(file);
    } catch (e) {
      redirect(
        `/admin/beranda?error=${encodeURIComponent((e as Error).message)}`
      );
    }
  }

  await upsertSetting(
    "hero_headline",
    (formData.get("hero_headline") as string) ?? ""
  );
  await upsertSetting(
    "hero_description",
    (formData.get("hero_description") as string) ?? ""
  );
  await upsertSetting(
    "hero_supporting_text",
    (formData.get("hero_supporting_text") as string) ?? ""
  );
  await upsertSetting(
    "hero_cta_text",
    (formData.get("hero_cta_text") as string) ?? ""
  );
  await upsertSetting("hero_photo_url", photoUrl);

  let midCtaPhotoUrl = (formData.get("mid_cta_photo_url") as string) ?? "";
  const midFile = formData.get("mid_cta_photo");
  if (midFile instanceof File && midFile.size > 0) {
    try {
      midCtaPhotoUrl = await saveHomePhoto(midFile);
    } catch (e) {
      redirect(
        `/admin/beranda?error=${encodeURIComponent((e as Error).message)}`
      );
    }
  }
  await upsertSetting("mid_cta_photo_url", midCtaPhotoUrl);

  revalidateCmsTag(CACHE_TAGS.siteSettings);
  revalidatePath("/");
  redirect("/admin/beranda?saved=1");
}
