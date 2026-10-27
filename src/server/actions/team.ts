"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  roleTitle: z.string().optional(),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  licenseNumber: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

function parseExpertise(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function revalidateTeam() {
  revalidateCmsTag(CACHE_TAGS.team);
  revalidatePath("/tim");
  revalidatePath("/admin/tim");
}

export async function createTeamMember(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    roleTitle: (formData.get("roleTitle") as string) || undefined,
    photoUrl: (formData.get("photoUrl") as string) || undefined,
    bio: (formData.get("bio") as string) || undefined,
    expertise: (formData.get("expertise") as string) || undefined,
    licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = teamSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/tim/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  await db.insert(schema.teamMembers).values({
    name: data.name,
    roleTitle: data.roleTitle ?? null,
    photoUrl: data.photoUrl || null,
    bio: data.bio ?? null,
    expertise: parseExpertise(data.expertise),
    licenseNumber: data.licenseNumber ?? null,
    sortOrder: data.sortOrder,
    status: "draft",
  });

  revalidateTeam();
  redirect("/admin/tim");
}

export async function updateTeamMember(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    roleTitle: (formData.get("roleTitle") as string) || undefined,
    photoUrl: (formData.get("photoUrl") as string) || undefined,
    bio: (formData.get("bio") as string) || undefined,
    expertise: (formData.get("expertise") as string) || undefined,
    licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    sortOrder: formData.get("sortOrder") as string,
  };

  const parsed = teamSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/tim/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  await db
    .update(schema.teamMembers)
    .set({
      name: data.name,
      roleTitle: data.roleTitle ?? null,
      photoUrl: data.photoUrl || null,
      bio: data.bio ?? null,
      expertise: parseExpertise(data.expertise),
      licenseNumber: data.licenseNumber ?? null,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)));

  revalidateTeam();
  redirect("/admin/tim");
}

export async function publishTeamMember(id: string) {
  await requireAdmin();
  await db
    .update(schema.teamMembers)
    .set({ status: "published", updatedAt: new Date() })
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)));
  revalidateTeam();
}

export async function unpublishTeamMember(id: string) {
  await requireAdmin();
  await db
    .update(schema.teamMembers)
    .set({ status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)));
  revalidateTeam();
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await db
    .update(schema.teamMembers)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)));
  revalidateTeam();
  redirect("/admin/tim");
}
