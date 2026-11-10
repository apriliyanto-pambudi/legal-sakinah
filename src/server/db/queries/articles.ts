import { db, schema } from "@/server/db";
import { and, desc, eq, isNull } from "drizzle-orm";

export type ArticleRow = typeof schema.articles.$inferSelect;

export async function getPublishedArticlesFromDb(): Promise<ArticleRow[]> {
  return db
    .select()
    .from(schema.articles)
    .where(
      and(
        eq(schema.articles.status, "published"),
        isNull(schema.articles.deletedAt)
      )
    )
    .orderBy(desc(schema.articles.publishedAt));
}

export async function getAllArticlesForAdmin(): Promise<ArticleRow[]> {
  return db
    .select()
    .from(schema.articles)
    .where(isNull(schema.articles.deletedAt))
    .orderBy(desc(schema.articles.createdAt));
}

export async function hasAnyArticlesInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.articles.id })
    .from(schema.articles)
    .where(isNull(schema.articles.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getArticleBySlugFromDb(
  slug: string
): Promise<ArticleRow | null> {
  const rows = await db
    .select()
    .from(schema.articles)
    .where(
      and(
        eq(schema.articles.slug, slug),
        eq(schema.articles.status, "published"),
        isNull(schema.articles.deletedAt)
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getArticleByIdForAdmin(
  id: string
): Promise<ArticleRow | null> {
  const rows = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}
