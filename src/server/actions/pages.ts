"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
    content: (formData.get("content") as string) || undefined,
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
