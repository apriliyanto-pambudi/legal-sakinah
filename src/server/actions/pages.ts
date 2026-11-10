"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { plainTextToHtml } from "@/lib/content/plain-text";
import { eq } from "drizzle-orm";
import { z } from "zod";

async function upsertSetting(key: string, value: string) {
  await db
    .insert(schema.siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

/** Save halaman Kontak: title → pages, banner desc → site_settings */
export async function updateKontakPage(id: string, formData: FormData) {
  await requireAdmin();
  const title = (formData.get("title") as string)?.trim();
  if (!title) redirect(`/admin/halaman/${id}?error=${encodeURIComponent("Judul wajib diisi")}`);
  await db.update(schema.pages).set({ title, updatedAt: new Date() }).where(eq(schema.pages.id, id));
  await upsertSetting("kontak_banner_desc", (formData.get("kontak_banner_desc") as string) ?? "");
  revalidateCmsTag(CACHE_TAGS.siteSettings);
  revalidateCmsTag(CACHE_TAGS.pages);
  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  redirect(`/admin/halaman/${id}?saved=1`);
}

/** Save halaman Privasi: title + content → pages */
export async function updatePrivasiPage(id: string, formData: FormData) {
  await requireAdmin();
  const title = (formData.get("title") as string)?.trim();
  if (!title) redirect(`/admin/halaman/${id}?error=${encodeURIComponent("Judul wajib diisi")}`);
  const content = plainTextToHtml((formData.get("content") as string) ?? "") || null;
  const rows = await db
    .update(schema.pages)
    .set({ title, content, updatedAt: new Date() })
    .where(eq(schema.pages.id, id))
    .returning({ slug: schema.pages.slug });
  revalidateCmsTag(CACHE_TAGS.pages);
  revalidatePath(`/${rows[0]?.slug ?? "kebijakan-privasi"}`);
  revalidatePath("/admin/halaman");
  redirect(`/admin/halaman/${id}?saved=1`);
}

/** Unified save untuk halaman Tentang: title → pages, konten → site_settings */
export async function updateTentangPage(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  if (!title) redirect(`/admin/halaman/${id}?error=${encodeURIComponent("Judul wajib diisi")}`);

  await db
    .update(schema.pages)
    .set({ title, updatedAt: new Date() })
    .where(eq(schema.pages.id, id));

  for (const key of ["tentang_banner_desc", "tentang_practice_areas", "tentang_nilai_text"] as const) {
    await upsertSetting(key, (formData.get(key) as string) ?? "");
  }

  revalidateCmsTag(CACHE_TAGS.siteSettings);
  revalidateCmsTag(CACHE_TAGS.pages);
  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  redirect(`/admin/halaman/${id}?saved=1`);
}

const pageSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

function revalidatePage(slug?: string) {
  revalidateCmsTag(CACHE_TAGS.pages);
  revalidatePath("/admin/halaman");
  if (slug) revalidatePath(`/${slug}`);
}

export async function updatePage(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    title: formData.get("title") as string,
    content: plainTextToHtml((formData.get("content") as string) ?? "") || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
  };

  const parsed = pageSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/halaman/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  const rows = await db
    .update(schema.pages)
    .set({
      title: data.title,
      content: data.content ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      updatedAt: new Date(),
    })
    .where(eq(schema.pages.id, id))
    .returning({ slug: schema.pages.slug });

  revalidatePage(rows[0]?.slug);
  redirect("/admin/halaman");
}

export async function publishPage(id: string) {
  await requireAdmin();
  const rows = await db
    .update(schema.pages)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(schema.pages.id, id))
    .returning({ slug: schema.pages.slug });
  revalidatePage(rows[0]?.slug);
}

export async function unpublishPage(id: string) {
  await requireAdmin();
  const rows = await db
    .update(schema.pages)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(schema.pages.id, id))
    .returning({ slug: schema.pages.slug });
  revalidatePage(rows[0]?.slug);
}
