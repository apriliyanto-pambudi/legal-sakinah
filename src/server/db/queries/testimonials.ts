import { db, schema } from "@/server/db";
import { and, asc, eq, isNull } from "drizzle-orm";

export type TestimonialRow = typeof schema.testimonials.$inferSelect;

export async function getPublishedTestimonialsFromDb(): Promise<TestimonialRow[]> {
  return db
    .select()
    .from(schema.testimonials)
    .where(
      and(
        eq(schema.testimonials.status, "published"),
        isNull(schema.testimonials.deletedAt)
      )
    )
    .orderBy(asc(schema.testimonials.sortOrder));
}

export async function getAllTestimonialsForAdmin(): Promise<TestimonialRow[]> {
  return db
    .select()
    .from(schema.testimonials)
    .where(isNull(schema.testimonials.deletedAt))
    .orderBy(asc(schema.testimonials.sortOrder));
}

export async function hasAnyTestimonialsInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.testimonials.id })
    .from(schema.testimonials)
    .where(isNull(schema.testimonials.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getTestimonialByIdForAdmin(
  id: string
): Promise<TestimonialRow | null> {
  const rows = await db
    .select()
    .from(schema.testimonials)
    .where(
      and(eq(schema.testimonials.id, id), isNull(schema.testimonials.deletedAt))
    )
    .limit(1);
  return rows[0] ?? null;
}
