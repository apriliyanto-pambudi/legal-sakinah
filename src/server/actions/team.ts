"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull, max } from "drizzle-orm";
import { z } from "zod";
import { saveTeamPhoto } from "@/lib/upload";
import { parsePhotoFocus } from "@/lib/content/team";

const teamSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  roleTitle: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  licenseNumber: z.string().optional(),
  photoFocus: z.enum(["top", "center", "bottom"]).default("center"),
});

async function resolvePhotoUrl(
  formData: FormData,
  errorRedirectUrl: string
): Promise<string | undefined> {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      return await saveTeamPhoto(file);
    } catch (e) {
      redirect(`${errorRedirectUrl}?error=${encodeURIComponent((e as Error).message)}`);
    }
  }
  return (formData.get("photoUrl") as string) || undefined;
}

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

  const photoUrl = await resolvePhotoUrl(formData, "/admin/tim/new");

  const raw = {
    name: formData.get("name") as string,
    roleTitle: (formData.get("roleTitle") as string) || undefined,
    bio: (formData.get("bio") as string) || undefined,
    expertise: (formData.get("expertise") as string) || undefined,
    licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    photoFocus: parsePhotoFocus(formData.get("photoFocus")),
  };

  const parsed = teamSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/tim/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  const [agg] = await db
    .select({ maxOrder: max(schema.teamMembers.sortOrder) })
    .from(schema.teamMembers)
    .where(isNull(schema.teamMembers.deletedAt));
  const nextOrder = (agg?.maxOrder ?? 0) + 1;

  await db.insert(schema.teamMembers).values({
    name: data.name,
    roleTitle: data.roleTitle ?? null,
    photoUrl: photoUrl || null,
    photoFocus: data.photoFocus,
    bio: data.bio ?? null,
    expertise: parseExpertise(data.expertise),
    licenseNumber: data.licenseNumber ?? null,
    sortOrder: nextOrder,
    status: "draft",
  });

  revalidateTeam();
  redirect("/admin/tim");
}

export async function updateTeamMember(id: string, formData: FormData) {
  await requireAdmin();

  const photoUrl = await resolvePhotoUrl(formData, `/admin/tim/${id}`);

  const raw = {
    name: formData.get("name") as string,
    roleTitle: (formData.get("roleTitle") as string) || undefined,
    bio: (formData.get("bio") as string) || undefined,
    expertise: (formData.get("expertise") as string) || undefined,
    licenseNumber: (formData.get("licenseNumber") as string) || undefined,
    photoFocus: parsePhotoFocus(formData.get("photoFocus")),
  };

  const parsed = teamSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/tim/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`);
  }

  const data = parsed.data;

  // sortOrder hanya diubah lewat reorderTeamMembers (drag-drop)
  await db
    .update(schema.teamMembers)
    .set({
      name: data.name,
      roleTitle: data.roleTitle ?? null,
      photoUrl: photoUrl || null,
      photoFocus: data.photoFocus,
      bio: data.bio ?? null,
      expertise: parseExpertise(data.expertise),
      licenseNumber: data.licenseNumber ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(schema.teamMembers.id, id), isNull(schema.teamMembers.deletedAt)));

  revalidateTeam();
  redirect("/admin/tim");
}

export async function reorderTeamMembers(
  items: { id: string; sortOrder: number }[]
) {
  await requireAdmin();
  if (!items.length) return;

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(schema.teamMembers)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(
          and(
            eq(schema.teamMembers.id, item.id),
            isNull(schema.teamMembers.deletedAt)
          )
        );
    }
  });

  revalidateTeam();
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
