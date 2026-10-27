import { db, schema } from "@/server/db";
import { and, asc, eq, isNull } from "drizzle-orm";

export type ServiceRow = typeof schema.services.$inferSelect;

export async function getPublishedServicesFromDb(): Promise<ServiceRow[]> {
  return db
    .select()
    .from(schema.services)
    .where(
      and(eq(schema.services.status, "published"), isNull(schema.services.deletedAt))
    )
    .orderBy(asc(schema.services.sortOrder));
}

export async function getServiceBySlugFromDb(slug: string): Promise<ServiceRow | null> {
  const rows = await db
    .select()
    .from(schema.services)
    .where(
      and(
        eq(schema.services.slug, slug),
        eq(schema.services.status, "published"),
        isNull(schema.services.deletedAt)
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllServicesForAdmin(): Promise<ServiceRow[]> {
  return db
    .select()
    .from(schema.services)
    .where(isNull(schema.services.deletedAt))
    .orderBy(asc(schema.services.sortOrder));
}

export async function hasAnyServicesInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.services.id })
    .from(schema.services)
    .where(isNull(schema.services.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getServiceByIdForAdmin(id: string): Promise<ServiceRow | null> {
  const rows = await db
    .select()
    .from(schema.services)
    .where(and(eq(schema.services.id, id), isNull(schema.services.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}
