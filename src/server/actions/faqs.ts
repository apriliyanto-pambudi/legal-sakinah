"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull, max } from "drizzle-orm";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
  category: z.string().optional(),
  scope: z.enum(["global", "service", "landing_page"]).default("global"),
});

function revalidateFaqs() {
  revalidateCmsTag(CACHE_TAGS.faqs);
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin/faq");
}

export async function createFaq(formData: FormData) {
  await requireAdmin();

  const raw = {
    question: formData.get("question") as string,
    answer: formData.get("answer") as string,
    category: (formData.get("category") as string) || undefined,
    scope: (formData.get("scope") as string) || "global",
  };

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/faq/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  const [agg] = await db
    .select({ maxOrder: max(schema.faqs.sortOrder) })
    .from(schema.faqs)
    .where(isNull(schema.faqs.deletedAt));
  const nextOrder = (agg?.maxOrder ?? 0) + 1;

  await db.insert(schema.faqs).values({
    question: data.question,
    answer: data.answer,
    category: data.category ?? null,
    scope: data.scope,
    sortOrder: nextOrder,
    status: "draft",
  });

  revalidateFaqs();
  redirect("/admin/faq");
}

export async function updateFaq(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    question: formData.get("question") as string,
    answer: formData.get("answer") as string,
    category: (formData.get("category") as string) || undefined,
    scope: (formData.get("scope") as string) || "global",
  };

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/faq/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  // sortOrder hanya diubah lewat reorderFaqs (drag-drop)
  await db
    .update(schema.faqs)
    .set({
      question: data.question,
      answer: data.answer,
      category: data.category ?? null,
      scope: data.scope,
      updatedAt: new Date(),
    })
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)));

  revalidateFaqs();
  redirect("/admin/faq");
}

export async function reorderFaqs(items: { id: string; sortOrder: number }[]) {
  await requireAdmin();
  if (!items.length) return;

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(schema.faqs)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(and(eq(schema.faqs.id, item.id), isNull(schema.faqs.deletedAt)));
    }
  });

  revalidateFaqs();
}

export async function publishFaq(id: string) {
  await requireAdmin();
  await db
    .update(schema.faqs)
    .set({ status: "published", updatedAt: new Date() })
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)));
  revalidateFaqs();
}

export async function unpublishFaq(id: string) {
  await requireAdmin();
  await db
    .update(schema.faqs)
    .set({ status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)));
  revalidateFaqs();
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await db
    .update(schema.faqs)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)));
  revalidateFaqs();
  redirect("/admin/faq");
}
