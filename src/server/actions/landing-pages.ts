"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/server/db";
import { requireAdmin } from "@/server/auth/guard";
import { CACHE_TAGS, revalidateCmsTag } from "@/server/cache";
import { isUniqueViolation, zodErrorMessage } from "@/lib/validations/form-error";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { saveLpBanner } from "@/lib/upload";

/** Digits only; leading 08 → 62. Empty → undefined (pakai default situs). */
function normalizeWaOverride(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("08")) digits = `62${digits.slice(1)}`;
  return digits;
}

const waOverrideSchema = z
  .string()
  .optional()
  .transform((v) => normalizeWaOverride(v))
  .refine((v) => v === undefined || /^62\d{8,13}$/.test(v), {
    message: "Nomor WhatsApp tidak valid. Contoh: 62812…",
  });

const lpMetaSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  internalName: z.string().optional(),
  headline: z.string().min(1, "Headline wajib diisi"),
  subheadline: z.string().optional(),
  heroImageUrl: z.string().optional(),
  primaryCtaText: z.string().default("Konsultasi via WhatsApp"),
  whatsappNumberOverride: waOverrideSchema,
  whatsappPrefill: z.string().optional(),
  campaignNote: z.string().optional(),
});
/** LP ads: hanya ini yang boleh ditambah dari admin. Renderer tipe lama tetap ada. */
const ADDABLE_BLOCK_TYPES = ["image_cards", "cta"] as const;

async function resolveHeroImageUrl(
  formData: FormData,
  errorRedirectUrl: string
): Promise<string | undefined> {
  const file = formData.get("heroBannerFile");
  if (file instanceof File && file.size > 0) {
    try {
      return await saveLpBanner(file);
    } catch (e) {
      redirect(`${errorRedirectUrl}?error=${encodeURIComponent((e as Error).message)}`);
    }
  }
  return (formData.get("heroImageUrl") as string) || undefined;
}

function revalidateLpCache(slug?: string) {
  revalidateCmsTag(CACHE_TAGS.landingPages);
  revalidatePath("/admin/landing-pages");
  if (slug) revalidatePath(`/${slug}`);
}

function lines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function pairs(
  value: FormDataEntryValue | null
): { title: string; description: string }[] {
  return lines(value).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), description: rest.join("|").trim() };
  });
}

function splitOn(value: FormDataEntryValue | null, left: string, right: string) {
  return lines(value).map((line) => {
    const [first, ...rest] = line.split("||");
    return { [left]: first.trim(), [right]: rest.join("||").trim() };
  });
}

function defaultBlockContent(blockType: string): Record<string, unknown> {
  switch (blockType) {
    case "hero":
      return { badges: [], supportingNote: "" };
    case "problem":
      return { eyebrow: "", title: "", intro: "", items: [] };
    case "solution":
      return { eyebrow: "", title: "", intro: "", items: [] };
    case "process":
      return { eyebrow: "", title: "", steps: [] };
    case "proof":
      return { eyebrow: "", title: "", points: [], testimonials: [], note: "" };
    case "faq":
      return { eyebrow: "", title: "", items: [] };
    case "cta":
      return { title: "", description: "", ctaText: "Konsultasi via WhatsApp" };
    case "image_cards":
      return { cards: [] };
    case "custom_html":
      return { html: "" };
    default:
      return {};
  }
}

async function parseImageCardsFromForm(
  formData: FormData,
  errorRedirectUrl: string
) {
  const count = Number.parseInt(String(formData.get("cardCount") ?? "0"), 10) || 0;
  const cards: { imageUrl: string }[] = [];

  for (let i = 0; i < count; i++) {
    if (formData.get(`cardRemove_${i}`) === "1") continue;

    let imageUrl = String(formData.get(`cardImageUrl_${i}`) ?? "").trim();

    const file = formData.get(`cardImage_${i}`);
    if (file instanceof File && file.size > 0) {
      try {
        imageUrl = await saveLpBanner(file);
      } catch (e) {
        redirect(
          `${errorRedirectUrl}?error=${encodeURIComponent((e as Error).message)}&tab=blocks`
        );
      }
    }

    if (!imageUrl) continue;
    cards.push({ imageUrl });
  }

  return cards;
}

async function parseBlockContent(
  blockType: string,
  formData: FormData,
  errorRedirectUrl: string
): Promise<Record<string, unknown>> {
  switch (blockType) {
    case "hero":
      return {
        badges: lines(formData.get("badges")),
        supportingNote: String(formData.get("supportingNote") ?? ""),
      };
    case "problem":
      return {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        intro: String(formData.get("intro") ?? ""),
        items: lines(formData.get("items")),
      };
    case "solution":
      return {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        intro: String(formData.get("intro") ?? ""),
        items: pairs(formData.get("items")),
      };
    case "process":
      return {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        steps: pairs(formData.get("steps")),
      };
    case "proof":
      return {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        points: lines(formData.get("points")),
        testimonials: splitOn(formData.get("testimonials"), "quote", "attribution"),
        note: String(formData.get("note") ?? ""),
      };
    case "faq":
      return {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        items: splitOn(formData.get("items"), "question", "answer"),
      };
    case "cta":
      return {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        ctaText: String(formData.get("ctaText") ?? "Konsultasi via WhatsApp"),
      };
    case "image_cards":
      return {
        cards: await parseImageCardsFromForm(formData, errorRedirectUrl),
      };
    case "custom_html":
      return { html: String(formData.get("html") ?? "") };
    default:
      return defaultBlockContent(blockType);
  }
}

export async function createLandingPage(formData: FormData) {
  const session = await requireAdmin();

  const heroImageUrl = await resolveHeroImageUrl(formData, "/admin/landing-pages/new");

  const raw = {
    slug: formData.get("slug") as string,
    internalName: (formData.get("internalName") as string) || undefined,
    headline: formData.get("headline") as string,
    subheadline: (formData.get("subheadline") as string) || undefined,
    heroImageUrl,
    primaryCtaText:
      (formData.get("primaryCtaText") as string) || "Konsultasi via WhatsApp",
    whatsappNumberOverride:
      (formData.get("whatsappNumberOverride") as string) || undefined,
    whatsappPrefill: (formData.get("whatsappPrefill") as string) || undefined,
    campaignNote: (formData.get("campaignNote") as string) || undefined,
  };

  const parsed = lpMetaSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/landing-pages/new?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  let newId: string;
  try {
    const inserted = await db
      .insert(schema.landingPages)
      .values({
        slug: data.slug,
        internalName: data.internalName ?? null,
        headline: data.headline,
        subheadline: data.subheadline ?? null,
        heroImageUrl: data.heroImageUrl ?? null,
        primaryCtaText: data.primaryCtaText,
        whatsappNumberOverride: data.whatsappNumberOverride ?? null,
        whatsappPrefill: data.whatsappPrefill ?? null,
        campaignNote: data.campaignNote ?? null,
        status: "draft",
        noindex: true,
        createdBy: session.user.id,
      })
      .returning({ id: schema.landingPages.id });
    newId = inserted[0].id;
  } catch (error) {
    if (isUniqueViolation(error)) {
      redirect(
        `/admin/landing-pages/new?error=${encodeURIComponent("Slug sudah dipakai. Gunakan slug lain.")}`
      );
    }
    throw error;
  }

  revalidateLpCache();
  redirect(`/admin/landing-pages/${newId}`);
}

export async function updateLandingPageMeta(id: string, formData: FormData) {
  await requireAdmin();

  const heroImageUrl = await resolveHeroImageUrl(formData, `/admin/landing-pages/${id}`);

  const raw = {
    slug: formData.get("slug") as string,
    internalName: (formData.get("internalName") as string) || undefined,
    headline: formData.get("headline") as string,
    subheadline: (formData.get("subheadline") as string) || undefined,
    heroImageUrl,
    primaryCtaText:
      (formData.get("primaryCtaText") as string) || "Konsultasi via WhatsApp",
    whatsappNumberOverride:
      (formData.get("whatsappNumberOverride") as string) || undefined,
    whatsappPrefill: (formData.get("whatsappPrefill") as string) || undefined,
    campaignNote: (formData.get("campaignNote") as string) || undefined,
  };

  const parsed = lpMetaSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/landing-pages/${id}?error=${encodeURIComponent(zodErrorMessage(parsed.error))}`
    );
  }

  const data = parsed.data;

  const [current] = await db
    .select({
      status: schema.landingPages.status,
      slug: schema.landingPages.slug,
    })
    .from(schema.landingPages)
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .limit(1);

  // Published: slug locked (ubah URL putus iklan). Draft tetap boleh ganti.
  const slugToSave =
    current?.status === "published" ? current.slug : data.slug;

  let slug: string | undefined;
  try {
    const rows = await db
      .update(schema.landingPages)
      .set({
        slug: slugToSave,
        internalName: data.internalName ?? null,
        headline: data.headline,
        subheadline: data.subheadline ?? null,
        heroImageUrl: data.heroImageUrl ?? null,
        primaryCtaText: data.primaryCtaText,
        whatsappNumberOverride: data.whatsappNumberOverride ?? null,
        whatsappPrefill: data.whatsappPrefill ?? null,
        campaignNote: data.campaignNote ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
      .returning({ slug: schema.landingPages.slug });
    slug = rows[0]?.slug;
  } catch (error) {
    if (isUniqueViolation(error)) {
      redirect(
        `/admin/landing-pages/${id}?error=${encodeURIComponent("Slug sudah dipakai. Gunakan slug lain.")}`
      );
    }
    throw error;
  }
  revalidateLpCache(slug);
  redirect(`/admin/landing-pages/${id}?saved=1`);
}

export async function publishLandingPage(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.landingPages)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .returning({ slug: schema.landingPages.slug });

  revalidateLpCache(rows[0]?.slug);
}

export async function unpublishLandingPage(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.landingPages)
    .set({ status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .returning({ slug: schema.landingPages.slug });

  revalidateLpCache(rows[0]?.slug);
}

export async function deleteLandingPage(id: string) {
  await requireAdmin();

  const rows = await db
    .update(schema.landingPages)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .returning({ slug: schema.landingPages.slug });

  revalidateLpCache(rows[0]?.slug);
  redirect("/admin/landing-pages");
}

export async function duplicateLandingPage(id: string) {
  const session = await requireAdmin();

  const rows = await db
    .select()
    .from(schema.landingPages)
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .limit(1);

  const original = rows[0];
  if (!original) redirect("/admin/landing-pages");

  const newSlug = `${original.slug}-copy-${Date.now().toString(36)}`;

  const inserted = await db
    .insert(schema.landingPages)
    .values({
      slug: newSlug,
      internalName: original.internalName
        ? `${original.internalName} (kopi)`
        : null,
      headline: original.headline,
      subheadline: original.subheadline,
      heroImageUrl: original.heroImageUrl,
      primaryCtaText: original.primaryCtaText,
      whatsappNumberOverride: original.whatsappNumberOverride,
      whatsappPrefill: original.whatsappPrefill,
      campaignNote: original.campaignNote,
      themeVariant: original.themeVariant,
      status: "draft",
      noindex: true,
      createdBy: session.user.id,
    })
    .returning({ id: schema.landingPages.id });

  const newId = inserted[0].id;

  const blocks = await db
    .select()
    .from(schema.landingPageBlocks)
    .where(eq(schema.landingPageBlocks.landingPageId, id));

  if (blocks.length > 0) {
    await db.insert(schema.landingPageBlocks).values(
      blocks.map((block) => ({
        landingPageId: newId,
        blockType: block.blockType,
        content: block.content,
        sortOrder: block.sortOrder,
        isVisible: block.isVisible,
      }))
    );
  }

  revalidateLpCache();
  redirect(`/admin/landing-pages/${newId}`);
}

export async function addBlock(landingPageId: string, formData: FormData) {
  await requireAdmin();

  const blockType = String(formData.get("blockType") ?? "");
  if (
    !ADDABLE_BLOCK_TYPES.includes(
      blockType as (typeof ADDABLE_BLOCK_TYPES)[number]
    )
  ) {
    redirect(
      `/admin/landing-pages/${landingPageId}?error=${encodeURIComponent("Tipe blok tidak valid")}&tab=blocks`
    );
  }

  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;

  await db.insert(schema.landingPageBlocks).values({
    landingPageId,
    blockType,
    content: defaultBlockContent(blockType),
    sortOrder,
    isVisible: true,
  });

  revalidateLpCache();
  redirect(`/admin/landing-pages/${landingPageId}?tab=blocks&saved=1`);
}

export async function updateBlock(
  blockId: string,
  landingPageId: string,
  formData: FormData
) {
  await requireAdmin();

  const existing = await db
    .select({
      blockType: schema.landingPageBlocks.blockType,
      content: schema.landingPageBlocks.content,
    })
    .from(schema.landingPageBlocks)
    .where(eq(schema.landingPageBlocks.id, blockId))
    .limit(1);

  const blockType = existing[0]?.blockType;
  if (!blockType) {
    redirect(`/admin/landing-pages/${landingPageId}?tab=blocks`);
  }

  const isVisible = formData.get("isVisible") !== "false";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;
  const errorRedirectUrl = `/admin/landing-pages/${landingPageId}`;
  // shortcut: hero field badge/note disembunyikan — jaga content agar bisa di-unhide
  const content =
    blockType === "hero"
      ? ((existing[0].content as Record<string, unknown>) ?? { badges: [], supportingNote: "" })
      : await parseBlockContent(blockType, formData, errorRedirectUrl);

  await db
    .update(schema.landingPageBlocks)
    .set({
      content,
      isVisible,
      sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(schema.landingPageBlocks.id, blockId));

  revalidateLpCache();
  redirect(`/admin/landing-pages/${landingPageId}?tab=blocks&saved=1`);
}

export async function deleteBlock(blockId: string, landingPageId: string) {
  await requireAdmin();
  await db
    .delete(schema.landingPageBlocks)
    .where(eq(schema.landingPageBlocks.id, blockId));
  revalidateLpCache();
  redirect(`/admin/landing-pages/${landingPageId}?tab=blocks`);
}

export async function reorderBlocks(
  landingPageId: string,
  items: { id: string; sortOrder: number }[]
) {
  await requireAdmin();
  if (!items.length) return;

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(schema.landingPageBlocks)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(
          and(
            eq(schema.landingPageBlocks.id, item.id),
            eq(schema.landingPageBlocks.landingPageId, landingPageId)
          )
        );
    }
  });

  revalidateLpCache();
}
