"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
  category: z.string().optional(),
  scope: z.enum(["global", "service", "landing_page"]).default("global"),
  sortOrder: z.coerce.number().int().default(0),
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
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/faq/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  await db.insert(schema.faqs).values({
    question: data.question,
    answer: data.answer,
    category: data.category ?? null,
    scope: data.scope,
    sortOrder: data.sortOrder,
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
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/faq/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  await db
    .update(schema.faqs)
    .set({
      question: data.question,
      answer: data.answer,
      category: data.category ?? null,
      scope: data.scope,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)));

  revalidateFaqs();
  redirect("/admin/faq");
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
