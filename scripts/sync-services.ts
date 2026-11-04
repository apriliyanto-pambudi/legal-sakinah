/**
 * Sinkronkan katalog layanan (slug baru + update konten).
 * Soft-delete slug lama yang tidak ada di katalog.
 *
 * Jalankan: pnpm exec tsx scripts/sync-services.ts
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { and, eq, isNull, notInArray } = await import("drizzle-orm");
  const { db, schema } = await import("../src/server/db");
  const { services } = await import("../src/lib/content/services");

  const slugs = services.map((s) => s.slug);

  for (const service of services) {
    const existing = await db
      .select({ id: schema.services.id })
      .from(schema.services)
      .where(eq(schema.services.slug, service.slug))
      .limit(1);

    const payload = {
      title: service.title,
      summary: service.summary,
      content: service.content.trim(),
      icon: service.icon,
      seoTitle: service.seoTitle ?? null,
      seoDescription: service.seoDescription ?? null,
      sortOrder: service.sortOrder,
      status: "published" as const,
      publishedAt: new Date(),
      deletedAt: null,
      updatedAt: new Date(),
    };

    if (existing[0]) {
      await db
        .update(schema.services)
        .set(payload)
        .where(eq(schema.services.id, existing[0].id));
      console.log("update", service.slug);
    } else {
      await db.insert(schema.services).values({
        slug: service.slug,
        ...payload,
      });
      console.log("insert", service.slug);
    }
  }

  const removed = await db
    .update(schema.services)
    .set({ deletedAt: new Date(), status: "draft", updatedAt: new Date() })
    .where(
      and(isNull(schema.services.deletedAt), notInArray(schema.services.slug, slugs))
    )
    .returning({ slug: schema.services.slug });

  for (const row of removed) {
    console.log("soft-delete", row.slug);
  }

  console.log("sync layanan selesai:", slugs.length, "aktif");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
