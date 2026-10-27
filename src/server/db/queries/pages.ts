import { db, schema } from "@/server/db";
import { and, eq } from "drizzle-orm";

export type PageRow = typeof schema.pages.$inferSelect;

export async function getAllPagesForAdmin(): Promise<PageRow[]> {
  return db.select().from(schema.pages).orderBy(schema.pages.slug);
}

export async function getPageByIdForAdmin(id: string): Promise<PageRow | null> {
  const rows = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const rows = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedPageBySlug(slug: string): Promise<PageRow | null> {
  const rows = await db
    .select()
    .from(schema.pages)
    .where(and(eq(schema.pages.slug, slug), eq(schema.pages.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}
