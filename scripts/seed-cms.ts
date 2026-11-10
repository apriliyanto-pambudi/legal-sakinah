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
  const { eq, isNull } = await import("drizzle-orm");
  const { db, schema } = await import("../src/server/db");
  const { faqItems } = await import("../src/lib/content/faq");
  const {
    getPublishedLandingPage,
    getPublishedLandingPageSlugs,
  } = await import("../src/lib/content/landing-pages");
  const { services } = await import("../src/lib/content/services");
  const { siteConfig } = await import("../src/lib/content/site");
  const { teamMembers } = await import("../src/lib/content/team");
  const { articles } = await import("../src/lib/content/articles");
  const { testimonials } = await import("../src/lib/content/testimonials");

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

  const existingArticles = await db
    .select({ slug: schema.articles.slug })
    .from(schema.articles)
    .where(isNull(schema.articles.deletedAt));
  const articleSlugs = new Set(existingArticles.map((row) => row.slug));

  for (const article of articles) {
    if (articleSlugs.has(article.slug)) continue;
    await db.insert(schema.articles).values({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content.trim(),
      seoTitle: article.seoTitle ?? null,
      seoDescription: article.seoDescription ?? null,
      status: "published",
      publishedAt: new Date(article.publishedAt),
    });
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

  const existingTestimonials = await db
    .select({ quote: schema.testimonials.quote })
    .from(schema.testimonials)
    .where(isNull(schema.testimonials.deletedAt));
  const testimonialQuotes = new Set(
    existingTestimonials.map((row) => row.quote)
  );

  for (const [index, item] of testimonials.entries()) {
    if (testimonialQuotes.has(item.quote)) continue;
    await db.insert(schema.testimonials).values({
      quote: item.quote,
      attribution: item.attribution,
      serviceSlug: item.serviceSlug ?? null,
      sortOrder: index + 1,
      status: "published",
    });
  }

  // Selaraskan slug layanan lama di testimoni yang sudah ada
  const legacyServiceSlugs: Record<string, string | null> = {
    perceraian: "perceraian-muslim",
    "hak-asuh-anak": "perceraian-hak-asuh",
    "nafkah-harta-bersama": "harta-bersama",
    "kdrt-perlindungan-hukum": null,
    waris: null,
  };
  for (const [from, to] of Object.entries(legacyServiceSlugs)) {
    await db
      .update(schema.testimonials)
      .set({ serviceSlug: to, updatedAt: new Date() })
      .where(eq(schema.testimonials.serviceSlug, from));
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

  for (const lpSlug of getPublishedLandingPageSlugs()) {
    const exampleLp = getPublishedLandingPage(lpSlug);
    if (!exampleLp) continue;

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
    ["site_motto", siteConfig.motto],
    ["site_description", siteConfig.description],
    ["instagram_url", siteConfig.socialLinks.instagram],
    ["facebook_url", siteConfig.socialLinks.facebook],
    // Hero beranda — sinkron dengan fallback di cms.ts
    [
      "hero_headline",
      "Pendampingan hukum keluarga yang tenang, jujur, dan dapat dipercaya.",
    ],
    [
      "hero_description",
      "Spesialis perkara perceraian, hak asuh anak, harta bersama, isbat nikah, waris, dan perlindungan hukum keluarga — didampingi dengan kepekaan terhadap situasi yang sensitif.",
    ],
    [
      "hero_supporting_text",
      "Langkah pertama adalah percakapan. Tanpa tekanan, tanpa komitmen.",
    ],
    ["hero_cta_text", "Konsultasi via WhatsApp"],
    ["hero_photo_url", ""],
    ["mid_cta_photo_url", ""],
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
