"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { plainTextToHtml } from "@/lib/content/plain-text";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

function revalidateArticles(slug?: string) {
  revalidateCmsTag(CACHE_TAGS.articles);
  revalidatePath("/artikel");
  revalidatePath("/");
  revalidatePath("/admin/artikel");
  if (slug) revalidatePath(`/artikel/${slug}`);
}

export async function createArticle(formData: FormData) {
  await requireAdmin();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: (formData.get("excerpt") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/artikel/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  try {
    await db.insert(schema.articles).values({
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt?.trim() || null,
      content: data.content ? plainTextToHtml(data.content) : null,
      seoTitle: data.seoTitle?.trim() || null,
      seoDescription: data.seoDescription?.trim() || null,
      status: "draft",
    });
  } catch {
    redirect(
      `/admin/artikel/new?error=${encodeURIComponent("Slug sudah dipakai — gunakan slug lain.")}`
    );
  }

  revalidateArticles();
  redirect("/admin/artikel");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: (formData.get("excerpt") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/artikel/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  const [current] = await db
    .select({ slug: schema.articles.slug })
    .from(schema.articles)
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)));
  const oldSlug = current?.slug;

  try {
    await db
      .update(schema.articles)
      .set({
        title: data.title.trim(),
        slug: data.slug.trim(),
        excerpt: data.excerpt?.trim() || null,
        content: data.content ? plainTextToHtml(data.content) : null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt))
      );
  } catch {
    redirect(
      `/admin/artikel/${id}?error=${encodeURIComponent("Slug sudah dipakai — gunakan slug lain.")}`
    );
  }

  revalidateArticles(oldSlug);
  if (data.slug !== oldSlug) revalidatePath(`/artikel/${data.slug}`);
  redirect("/admin/artikel");
}

export async function publishArticle(id: string) {
  await requireAdmin();

  const [current] = await db
    .select({ publishedAt: schema.articles.publishedAt })
    .from(schema.articles)
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)));

  const rows = await db
    .update(schema.articles)
    .set({
      status: "published",
      publishedAt: current?.publishedAt ?? new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .returning({ slug: schema.articles.slug });

  revalidateArticles(rows[0]?.slug);
}

export async function unpublishArticle(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.articles)
    .set({ status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .returning({ slug: schema.articles.slug });

  revalidateArticles(rows[0]?.slug);
}

export async function deleteArticle(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.articles)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .returning({ slug: schema.articles.slug });

  revalidateArticles(rows[0]?.slug);
  redirect("/admin/artikel");
}
