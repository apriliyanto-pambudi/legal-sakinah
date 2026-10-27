"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { isUniqueViolation, zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  title: z.string().min(1, "Judul wajib diisi"),
  summary: z.string().optional(),
  content: z.string().optional(),
  icon: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateServices(slug?: string) {
  revalidateCmsTag(CACHE_TAGS.services);
  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/layanan");
  if (slug) revalidatePath(`/layanan/${slug}`);
}

export async function createService(formData: FormData) {
  await requireAdmin();

  const raw = {
    slug: (formData.get("slug") as string) || toSlug((formData.get("title") as string) ?? ""),
    title: formData.get("title") as string,
    summary: (formData.get("summary") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
    icon: (formData.get("icon") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/layanan/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  try {
    await db.insert(schema.services).values({
      slug: data.slug,
      title: data.title,
      summary: data.summary ?? null,
      content: data.content ?? null,
      icon: data.icon ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      sortOrder: data.sortOrder,
      status: "draft",
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      redirect(
        `/admin/layanan/new?error=${encodeURIComponent("Slug sudah dipakai. Gunakan slug lain.")}`
      );
    }
    throw error;
  }

  revalidateServices();
  redirect("/admin/layanan");
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    summary: (formData.get("summary") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
    icon: (formData.get("icon") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/layanan/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  try {
    await db
      .update(schema.services)
      .set({
        slug: data.slug,
        title: data.title,
        summary: data.summary ?? null,
        content: data.content ?? null,
        icon: data.icon ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.services.id, id), isNull(schema.services.deletedAt)));
  } catch (error) {
    if (isUniqueViolation(error)) {
      redirect(
        `/admin/layanan/${id}?error=${encodeURIComponent("Slug sudah dipakai. Gunakan slug lain.")}`
      );
    }
    throw error;
  }

  revalidateServices(data.slug);
  redirect("/admin/layanan");
}

export async function publishService(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.services)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(schema.services.id, id), isNull(schema.services.deletedAt)))
    .returning({ slug: schema.services.slug });

  revalidateServices(rows[0]?.slug);
}

export async function unpublishService(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.services)
    .set({ status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.services.id, id), isNull(schema.services.deletedAt)))
    .returning({ slug: schema.services.slug });

  revalidateServices(rows[0]?.slug);
}

export async function deleteService(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.services)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.services.id, id), isNull(schema.services.deletedAt)))
    .returning({ slug: schema.services.slug });

  revalidateServices(rows[0]?.slug);
  redirect("/admin/layanan");
}
