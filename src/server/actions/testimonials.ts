"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull, max } from "drizzle-orm";
import { z } from "zod";

const testimonialSchema = z.object({
  quote: z.string().min(1, "Kutipan wajib diisi"),
  attribution: z
    .string()
    .min(1, "Atribusi wajib diisi")
    .max(120, "Atribusi terlalu panjang — gunakan identitas samar"),
  serviceSlug: z.string().optional(),
});

function revalidateTestimonials() {
  revalidateCmsTag(CACHE_TAGS.testimonials);
  revalidatePath("/");
  revalidatePath("/admin/testimoni");
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();

  const raw = {
    quote: formData.get("quote") as string,
    attribution: formData.get("attribution") as string,
    serviceSlug: (formData.get("serviceSlug") as string) || undefined,
  };

  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/testimoni/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  const [agg] = await db
    .select({ maxOrder: max(schema.testimonials.sortOrder) })
    .from(schema.testimonials)
    .where(isNull(schema.testimonials.deletedAt));
  const nextOrder = (agg?.maxOrder ?? 0) + 1;

  await db.insert(schema.testimonials).values({
    quote: data.quote.trim(),
    attribution: data.attribution.trim(),
    serviceSlug: data.serviceSlug?.trim() || null,
    sortOrder: nextOrder,
    status: "draft",
  });

  revalidateTestimonials();
  redirect("/admin/testimoni");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    quote: formData.get("quote") as string,
    attribution: formData.get("attribution") as string,
    serviceSlug: (formData.get("serviceSlug") as string) || undefined,
  };

  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/testimoni/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  // sortOrder hanya diubah lewat reorderTestimonials (drag-drop)
  await db
    .update(schema.testimonials)
    .set({
      quote: data.quote.trim(),
      attribution: data.attribution.trim(),
      serviceSlug: data.serviceSlug?.trim() || null,
      updatedAt: new Date(),
    })
    .where(
      and(eq(schema.testimonials.id, id), isNull(schema.testimonials.deletedAt))
    );

  revalidateTestimonials();
  redirect("/admin/testimoni");
}

export async function reorderTestimonials(
  items: { id: string; sortOrder: number }[]
) {
  await requireAdmin();
  if (!items.length) return;

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(schema.testimonials)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(
          and(
            eq(schema.testimonials.id, item.id),
            isNull(schema.testimonials.deletedAt)
          )
        );
    }
  });

  revalidateTestimonials();
}

export async function publishTestimonial(id: string) {
  await requireAdmin();
  await db
    .update(schema.testimonials)
    .set({ status: "published", updatedAt: new Date() })
    .where(
      and(eq(schema.testimonials.id, id), isNull(schema.testimonials.deletedAt))
    );
  revalidateTestimonials();
}

export async function unpublishTestimonial(id: string) {
  await requireAdmin();
  await db
    .update(schema.testimonials)
    .set({ status: "draft", updatedAt: new Date() })
    .where(
      and(eq(schema.testimonials.id, id), isNull(schema.testimonials.deletedAt))
    );
  revalidateTestimonials();
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await db
    .update(schema.testimonials)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(
      and(eq(schema.testimonials.id, id), isNull(schema.testimonials.deletedAt))
    );
  revalidateTestimonials();
  redirect("/admin/testimoni");
}
