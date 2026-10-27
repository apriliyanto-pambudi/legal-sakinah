/**
 * Mengisi konten CMS awal dari dummy Tahap 3–4.
 *
 * Jalankan:  pnpm db:seed-cms
 *
 * Idempoten: baris yang sudah ada (slug / pertanyaan / nama / key) tidak ditimpa,
 * sehingga suntingan admin tetap aman.
 */

import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { isNull } = await import("drizzle-orm");
  const { db, schema } = await import("../src/server/db");
  const { faqItems } = await import("../src/lib/content/faq");
  const { getPublishedLandingPage } = await import("../src/lib/content/landing-pages");
  const { services } = await import("../src/lib/content/services");
  const { siteConfig } = await import("../src/lib/content/site");
  const { teamMembers } = await import("../src/lib/content/team");

  for (const service of services) {
    await db
      .insert(schema.services)
      .values({
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        content: service.content.trim(),
        icon: service.icon,
        seoTitle: service.seoTitle ?? null,
        seoDescription: service.seoDescription ?? null,
        sortOrder: service.sortOrder,
        status: "published",
        publishedAt: new Date(),
      })
      .onConflictDoNothing({ target: schema.services.slug });
  }

  const existingFaqs = await db
    .select({ question: schema.faqs.question })
    .from(schema.faqs)
    .where(isNull(schema.faqs.deletedAt));
  const faqQuestions = new Set(existingFaqs.map((row) => row.question));

  for (const faq of faqItems) {
    if (faqQuestions.has(faq.question)) continue;
    await db.insert(schema.faqs).values({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      scope: "global",
      sortOrder: faq.sortOrder,
      status: "published",
    });
  }

  const existingTeam = await db
    .select({ name: schema.teamMembers.name })
    .from(schema.teamMembers)
    .where(isNull(schema.teamMembers.deletedAt));
  const teamNames = new Set(existingTeam.map((row) => row.name));

  for (const member of teamMembers) {
    if (teamNames.has(member.name)) continue;
    await db.insert(schema.teamMembers).values({
      name: member.name,
      roleTitle: member.roleTitle,
      photoUrl: member.photoUrl ?? null,
      bio: member.bio,
      expertise: member.expertise,
      sortOrder: member.sortOrder,
      status: "published",
    });
  }

  const staticPages = [
    { slug: "tentang", title: "Tentang Kami" },
    { slug: "kontak", title: "Hubungi Kami" },
    { slug: "kebijakan-privasi", title: "Kebijakan Privasi" },
  ];

  for (const page of staticPages) {
    await db
      .insert(schema.pages)
      .values({
        slug: page.slug,
        title: page.title,
        content: null,
        status: "published",
      })
      .onConflictDoNothing({ target: schema.pages.slug });
  }

  const exampleLp = getPublishedLandingPage("promo-hak-asuh");
  if (exampleLp) {
    const inserted = await db
      .insert(schema.landingPages)
      .values({
        slug: exampleLp.slug,
        internalName: exampleLp.internalName,
        headline: exampleLp.headline,
        subheadline: exampleLp.subheadline,
        heroImageUrl: exampleLp.heroImageUrl,
        campaignNote: exampleLp.campaignNote,
        whatsappNumberOverride: exampleLp.whatsappNumberOverride,
        whatsappPrefill: exampleLp.whatsappPrefill,
        primaryCtaText: exampleLp.primaryCtaText,
        themeVariant: exampleLp.themeVariant,
        status: "published",
        noindex: true,
        publishedAt: new Date(),
      })
      .onConflictDoNothing({ target: schema.landingPages.slug })
      .returning({ id: schema.landingPages.id });

    const newId = inserted[0]?.id;
    if (newId) {
      await db.insert(schema.landingPageBlocks).values(
        exampleLp.blocks.map((block) => ({
          landingPageId: newId,
          blockType: block.blockType,
          content: block.content,
          sortOrder: block.sortOrder,
          isVisible: block.isVisible,
        }))
      );
    }
  }

  const settings: Array<[string, string]> = [
    ["whatsapp_number_default", siteConfig.waNumber],
    ["whatsapp_prefill_default", siteConfig.waPrefill],
    ["office_address", siteConfig.address],
    ["office_hours", siteConfig.officeHours],
    ["contact_email", siteConfig.email],
    ["site_name", siteConfig.name],
    ["site_tagline", siteConfig.tagline],
  ];

  for (const [key, value] of settings) {
    await db
      .insert(schema.siteSettings)
      .values({ key, value })
      .onConflictDoNothing({ target: schema.siteSettings.key });
  }

  console.log("Seed CMS selesai.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed CMS gagal:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
