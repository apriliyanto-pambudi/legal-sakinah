import { db, schema } from "@/server/db";
import { and, asc, eq, isNull } from "drizzle-orm";

export type TeamMemberRow = typeof schema.teamMembers.$inferSelect;

export async function getPublishedTeamFromDb(): Promise<TeamMemberRow[]> {
  return db
    .select()
    .from(schema.teamMembers)
    .where(
      and(
        eq(schema.teamMembers.status, "published"),
        isNull(schema.teamMembers.deletedAt)
      )
    )
    .orderBy(asc(schema.teamMembers.sortOrder));
}

export async function getAllTeamForAdmin(): Promise<TeamMemberRow[]> {
  return db
    .select()
    .from(schema.teamMembers)
    .where(isNull(schema.teamMembers.deletedAt))
    .orderBy(asc(schema.teamMembers.sortOrder));
}

export async function hasAnyTeamInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.teamMembers.id })
    .from(schema.teamMembers)
    .where(isNull(schema.teamMembers.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getTeamMemberByIdForAdmin(id: string): Promise<TeamMemberRow | null> {
  const rows = await db
    .select()
    .from(schema.teamMembers)
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}
