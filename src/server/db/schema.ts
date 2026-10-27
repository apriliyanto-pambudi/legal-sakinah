/**
 * Schema database Legal Sakinah — PRD Section 5.
 *
 * Aturan privasi (wajib):
 * - TIDAK menyimpan isi percakapan WhatsApp
 * - TIDAK menyimpan nomor telepon / nama / email pengunjung
 * - IP disimpan sebagai hash bersalt (ip_hash), bukan IP mentah
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// 5.1 Autentikasi admin (struktur mengikuti better-auth)
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** v1 hanya `admin`; role lain [TBD] */
  role: text("role").notNull().default("admin"),
  /** Nonaktifkan admin tanpa menghapus baris */
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** v1: "credential" */
    providerId: text("provider_id").notNull(),
    accountId: text("account_id").notNull(),
    /** Hash password — better-auth mengelola hashing */
    password: text("password"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_accounts_user_id").on(t.userId),
    // better-auth ≥1.7.3 mengenali akun lewat providerId + accountId
    uniqueIndex("uq_accounts_provider_account").on(t.providerId, t.accountId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Nilai session cookie */
    token: text("token").notNull().unique(),
    /** Durasi [TBD] — indikatif 7 hari */
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    /** IP admin internal — boleh disimpan (bukan pengunjung publik) */
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_sessions_user_id").on(t.userId)]
);

/** Token verifikasi / reset password — pemakaian v1 [TBD] */
export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_verifications_identifier").on(t.identifier)]
);

// ─────────────────────────────────────────────────────────────────────────────
// 5.2 Konten CMS
// ─────────────────────────────────────────────────────────────────────────────

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** URL: /layanan/{slug} */
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary"),
    /** Rich text — HTML tersanitasi / JSON, keputusan editor [TBD] */
    content: text("content"),
    icon: text("icon"),
    coverImageUrl: text("cover_image_url"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    /** draft | published */
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_services_status_sort").on(t.status, t.sortOrder)]
);

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** tentang | kontak | kebijakan-privasi */
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// landing_pages dideklarasikan sebelum faqs karena direferensikan FK
export const landingPages = pgTable(
  "landing_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Subdirectory, contoh: promo-hak-asuh */
    slug: text("slug").notNull().unique(),
    /** Nama internal untuk tim — tidak tampil publik */
    internalName: text("internal_name"),
    headline: text("headline").notNull(),
    subheadline: text("subheadline"),
    heroImageUrl: text("hero_image_url"),
    campaignNote: text("campaign_note"),
    /** Kosong = pakai default dari site_settings */
    whatsappNumberOverride: text("whatsapp_number_override"),
    /** Prefill khusus LP — teks final [TBD] */
    whatsappPrefill: text("whatsapp_prefill"),
    primaryCtaText: text("primary_cta_text")
      .notNull()
      .default("Konsultasi via WhatsApp"),
    /** Varian visual — opsi [TBD] */
    themeVariant: text("theme_variant"),
    /** draft | published | archived */
    status: text("status").notNull().default("draft"),
    /** Selalu true untuk LP ads */
    noindex: boolean("noindex").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_landing_pages_status").on(t.status)]
);

export const landingPageBlocks = pgTable(
  "landing_page_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    landingPageId: uuid("landing_page_id")
      .notNull()
      .references(() => landingPages.id, { onDelete: "cascade" }),
    /** hero | problem | solution | process | proof | faq | cta | custom_html */
    blockType: text("block_type").notNull(),
    /** Struktur per tipe blok — skema detail [TBD] */
    content: jsonb("content").notNull().default({}),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_lp_blocks_page_sort").on(t.landingPageId, t.sortOrder),
  ]
);

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    /** Pengelompokan, contoh: perceraian */
    category: text("category"),
    /** global | service | landing_page */
    scope: text("scope").notNull().default("global"),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "cascade",
    }),
    landingPageId: uuid("landing_page_id").references(() => landingPages.id, {
      onDelete: "cascade",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status").notNull().default("draft"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_faqs_scope_sort").on(t.scope, t.sortOrder),
    index("idx_faqs_service_id").on(t.serviceId),
    index("idx_faqs_landing_page_id").on(t.landingPageId),
  ]
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** Contoh: Advokat, Partner */
    roleTitle: text("role_title"),
    photoUrl: text("photo_url"),
    bio: text("bio"),
    expertise: text("expertise").array(),
    /** Nomor izin advokat — tampil/tidak [TBD] */
    licenseNumber: text("license_number"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status").notNull().default("draft"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_team_members_status_sort").on(t.status, t.sortOrder)]
);

/** Artikel edukasi — opsional v1 [TBD] */
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    coverImageUrl: text("cover_image_url"),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("idx_articles_status_published").on(t.status, t.publishedAt)]
);

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Path lokal atau URL object storage — strategi [TBD] */
  filePath: text("file_path").notNull(),
  fileName: text("file_name"),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  width: integer("width"),
  height: integer("height"),
  /** Untuk aksesibilitas */
  altText: text("alt_text"),
  uploadedBy: uuid("uploaded_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Site settings — key-value.
 * Kunci minimal: whatsapp_number_default, whatsapp_prefill_default,
 * ga4_measurement_id, meta_pixel_id, office_address, office_hours,
 * contact_email, social_links.
 */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// 5.4 Tracking event — tabel inti dashboard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cta_clicks — event klik CTA WhatsApp.
 *
 * DILARANG disimpan di sini:
 * - Isi percakapan WhatsApp
 * - Nomor telepon / nama / email pengunjung
 * - IP mentah (pakai ip_hash)
 * - Query string mentah di luar UTM yang di-whitelist
 */
export const ctaClicks = pgTable(
  "cta_clicks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Waktu SERVER — dasar seluruh agregasi dashboard */
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Waktu dari client — referensi saja, tidak dipercaya */
    clientTimestamp: timestamp("client_timestamp", { withTimezone: true }),
    pagePath: text("page_path").notNull(),
    /** Diisi bila klik dari LP ads; NULL bila dari website utama */
    lpSlug: text("lp_slug"),
    /** lp | site */
    pageType: text("page_type").notNull().default("site"),
    /** hero_wa | sticky_wa | footer_wa | faq_wa | ... */
    ctaLabel: text("cta_label").notNull(),
    // UTM disimpan APA ADANYA (hanya trim + potong panjang di layer service)
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    /** mobile | tablet | desktop — diturunkan dari user agent */
    deviceType: text("device_type"),
    /** Hash IP + salt harian — BUKAN IP mentah */
    ipHash: text("ip_hash"),
    /** ID acak dari client (sessionStorage) untuk deduplikasi */
    sessionId: text("session_id"),
    /** Klik berulang dalam jendela [TBD ~10s] */
    isDuplicate: boolean("is_duplicate").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_cta_clicks_occurred_at").on(t.occurredAt.desc()),
    index("idx_cta_clicks_lp_time").on(t.lpSlug, t.occurredAt.desc()),
    index("idx_cta_clicks_campaign").on(t.utmCampaign, t.occurredAt.desc()),
    index("idx_cta_clicks_page_type").on(t.pageType, t.occurredAt.desc()),
  ]
);

/**
 * rate_limit_hits — pendukung rate limit sederhana berbasis DB.
 * Dipakai oleh /api/events/cta (Tahap 4).
 */
export const rateLimitHits = pgTable("rate_limit_hits", {
  /** hash(IP) + endpoint */
  key: text("key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true })
    .notNull()
    .defaultNow(),
  count: integer("count").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type LandingPage = typeof landingPages.$inferSelect;
export type LandingPageBlock = typeof landingPageBlocks.$inferSelect;
export type CtaClick = typeof ctaClicks.$inferSelect;
export type NewCtaClick = typeof ctaClicks.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
