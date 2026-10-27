import { db, schema } from "@/server/db";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import type {
  LandingPageRecord,
  LandingPageBlock,
} from "@/lib/content/landing-pages";

export type LandingPageRow = typeof schema.landingPages.$inferSelect;
export type LandingPageBlockRow = typeof schema.landingPageBlocks.$inferSelect;

export async function getLandingPageWithBlocksFromDb(
  slug: string
): Promise<LandingPageRecord | null> {
  const rows = await db
    .select()
    .from(schema.landingPages)
    .where(
      and(
        eq(schema.landingPages.slug, slug),
        eq(schema.landingPages.status, "published"),
        isNull(schema.landingPages.deletedAt)
      )
    )
    .limit(1);

  const lp = rows[0];
  if (!lp) return null;

  const blockRows = await db
    .select()
    .from(schema.landingPageBlocks)
    .where(eq(schema.landingPageBlocks.landingPageId, lp.id))
    .orderBy(asc(schema.landingPageBlocks.sortOrder));

  return dbRowToRecord(lp, blockRows);
}

export async function getPublishedLandingPageSlugsFromDb(): Promise<string[]> {
  const rows = await db
    .select({ slug: schema.landingPages.slug })
    .from(schema.landingPages)
    .where(
      and(
        eq(schema.landingPages.status, "published"),
        isNull(schema.landingPages.deletedAt)
      )
    );
  return rows.map((r) => r.slug);
}

export async function hasAnyLandingPagesInDb(): Promise<boolean> {
  const rows = await db
    .select({ id: schema.landingPages.id })
    .from(schema.landingPages)
    .where(isNull(schema.landingPages.deletedAt))
    .limit(1);
  return rows.length > 0;
}

export async function getAllLandingPagesForAdmin(): Promise<LandingPageRow[]> {
  return db
    .select()
    .from(schema.landingPages)
    .where(isNull(schema.landingPages.deletedAt))
    .orderBy(desc(schema.landingPages.updatedAt));
}

export async function getLandingPageByIdForAdmin(
  id: string
): Promise<{ lp: LandingPageRow; blocks: LandingPageBlockRow[] } | null> {
  const rows = await db
    .select()
    .from(schema.landingPages)
    .where(and(eq(schema.landingPages.id, id), isNull(schema.landingPages.deletedAt)))
    .limit(1);
  const lp = rows[0];
  if (!lp) return null;

  const blocks = await db
    .select()
    .from(schema.landingPageBlocks)
    .where(eq(schema.landingPageBlocks.landingPageId, id))
    .orderBy(asc(schema.landingPageBlocks.sortOrder));

  return { lp, blocks };
}

function dbRowToRecord(
  lp: LandingPageRow,
  blockRows: LandingPageBlockRow[]
): LandingPageRecord {
  const blocks = blockRows
    .filter((b) => b.isVisible)
    .map((b) => ({
      blockType: b.blockType,
      content: b.content,
      sortOrder: b.sortOrder,
      isVisible: b.isVisible,
    })) as LandingPageBlock[];

  return {
    slug: lp.slug,
    internalName: lp.internalName ?? "",
    headline: lp.headline,
    subheadline: lp.subheadline,
    heroImageUrl: lp.heroImageUrl,
    campaignNote: lp.campaignNote,
    whatsappNumberOverride: lp.whatsappNumberOverride,
    whatsappPrefill: lp.whatsappPrefill,
    primaryCtaText: lp.primaryCtaText,
    themeVariant: lp.themeVariant,
    status: lp.status as "draft" | "published" | "archived",
    noindex: lp.noindex,
    blocks,
  };
}
