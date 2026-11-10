/**
 * Reset blok LP ke opsi admin saat ini: image_cards + cta saja.
 * Jalankan: pnpm exec tsx scripts/reset-lp-blocks.ts
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { eq, notInArray, asc } = await import("drizzle-orm");
  const { db, schema } = await import("../src/server/db");

  const KEEP = ["image_cards", "cta"];

  const lps = await db
    .select({ id: schema.landingPages.id, slug: schema.landingPages.slug })
    .from(schema.landingPages);

  console.log("LPs:", lps.map((l) => l.slug).join(", ") || "(none)");

  const deleted = await db
    .delete(schema.landingPageBlocks)
    .where(notInArray(schema.landingPageBlocks.blockType, KEEP))
    .returning({
      id: schema.landingPageBlocks.id,
      blockType: schema.landingPageBlocks.blockType,
    });

  console.log(
    "Deleted:",
    deleted.length,
    deleted.map((d) => d.blockType)
  );

  for (const lp of lps) {
    const blocks = await db
      .select()
      .from(schema.landingPageBlocks)
      .where(eq(schema.landingPageBlocks.landingPageId, lp.id))
      .orderBy(asc(schema.landingPageBlocks.sortOrder));

    for (let i = 0; i < blocks.length; i++) {
      await db
        .update(schema.landingPageBlocks)
        .set({ sortOrder: i })
        .where(eq(schema.landingPageBlocks.id, blocks[i].id));
    }

    console.log(
      lp.slug,
      "=>",
      blocks.map((b) => b.blockType).join(", ") || "(empty)"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
