import { db, schema } from "@/server/db";
import { and, asc, eq, isNull } from "drizzle-orm";

export type FaqRow = typeof schema.faqs.$inferSelect;

export async function getPublishedFaqsFromDb(): Promise<FaqRow[]> {
  return db
    .select()
    .from(schema.faqs)
    .where(
      and(
        eq(schema.faqs.status, "published"),
        isNull(schema.faqs.deletedAt),
        eq(schema.faqs.scope, "global")
      )
    )
    .orderBy(asc(schema.faqs.sortOrder));
}

export async function getAllFaqsForAdmin(): Promise<FaqRow[]> {
  return db
    .select()
    .from(schema.faqs)
    .where(isNull(schema.faqs.deletedAt))
    .orderBy(asc(schema.faqs.scope), asc(schema.faqs.sortOrder));
}

export async function hasAnyFaqsInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.faqs.id })
    .from(schema.faqs)
    .where(isNull(schema.faqs.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getFaqByIdForAdmin(id: string): Promise<FaqRow | null> {
  const rows = await db
    .select()
    .from(schema.faqs)
    .where(and(eq(schema.faqs.id, id), isNull(schema.faqs.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}
