/**
 * Konten landing page ads — dummy Tahap 4.
 *
 * Bentuk data sengaja mengikuti tabel `landing_pages` + `landing_page_blocks`
 * (PRD Section 5.3) supaya Tahap 5 cukup mengganti isi fungsi getter ini dengan
 * query database, tanpa menyentuh komponen render.
 */

export interface LandingPageBlockBase {
  sortOrder: number;
  isVisible: boolean;
}

export type LandingPageBlock = LandingPageBlockBase &
  (
    | {
        blockType: "hero";
        content: { badges: string[]; supportingNote: string };
      }
    | {
        blockType: "problem";
        content: { eyebrow: string; title: string; intro: string; items: string[] };
      }
    | {
        blockType: "solution";
        content: {
          eyebrow: string;
          title: string;
          intro: string;
          items: { title: string; description: string }[];
        };
      }
    | {
        blockType: "process";
        content: {
          eyebrow: string;
          title: string;
          steps: { title: string; description: string }[];
        };
      }
    | {
        blockType: "proof";
        content: {
          eyebrow: string;
          title: string;
          points: string[];
          testimonials: { quote: string; attribution: string }[];
          note: string;
        };
      }
    | {
        blockType: "faq";
        content: {
          eyebrow: string;
          title: string;
          items: { question: string; answer: string }[];
        };
      }
    | {
        blockType: "cta";
        content: { title: string; description: string; ctaText: string };
      }
    | {
        blockType: "image_cards";
        content: {
          cards: {
            imageUrl: string;
            /** Legacy — diabaikan di render publik */
            title?: string;
            caption?: string;
            ctaText?: string;
          }[];
        };
      }
    | {
        blockType: "custom_html";
        content: { html: string };
      }
  );

export interface LandingPageRecord {
  slug: string;
  /** Nama internal untuk tim marketing — tidak pernah dirender. */
  internalName: string;
  headline: string;
  subheadline: string | null;
  heroImageUrl: string | null;
  campaignNote: string | null;
  /** Kosong = pakai nomor default dari site settings. */
  whatsappNumberOverride: string | null;
  whatsappPrefill: string | null;
  primaryCtaText: string;
  themeVariant: string | null;
  status: "draft" | "published" | "archived";
  /** Selalu true untuk LP ads (PRD Section 6.2). */
  noindex: boolean;
  blocks: LandingPageBlock[];
}

/**
 * Disclaimer wajib di setiap LP (PRD Section 6.8).
 * Bunyi teks final menunggu materi dari klien.
 */
export const LP_DISCLAIMER =
  "Informasi pada halaman ini bersifat umum dan bukan merupakan nasihat hukum. Setiap perkara memiliki fakta dan pertimbangan hakim yang berbeda, sehingga hasilnya tidak dapat dijanjikan. Diperlukan konsultasi untuk menilai situasi Anda secara spesifik.";

const landingPages: LandingPageRecord[] = [
  {
    slug: "promo-hak-asuh",
    internalName: "Hak Asuh Anak — Jakarta (Google Ads)",
    headline: "Memperjuangkan Hak Asuh Anak Anda dengan Pendampingan yang Tepat",
    subheadline:
      "Konsultasi dan pendampingan advokat untuk perkara hak asuh anak di Pengadilan Agama maupun Pengadilan Negeri. Ceritakan situasi Anda lebih dulu — tanpa tekanan.",
    heroImageUrl: null,
    campaignNote: "Kampanye contoh untuk verifikasi tracking Tahap 4.",
    whatsappNumberOverride: null,
    whatsappPrefill:
      "Halo Legal Sakinah, saya ingin konsultasi mengenai hak asuh anak.",
    primaryCtaText: "Konsultasi via WhatsApp",
    themeVariant: null,
    status: "published",
    noindex: true,
    blocks: [
      {
        blockType: "cta",
        sortOrder: 0,
        isVisible: true,
        content: {
          title: "Langkah Pertama Cukup Satu Pesan",
          description:
            "Ceritakan situasi Anda kepada kami hari ini. Kami akan bantu memetakan pilihan yang tersedia sebelum Anda memutuskan apa pun.",
          ctaText: "Konsultasi Sekarang via WhatsApp",
        },
      },
    ],
  },
  {
    slug: "promo-konsultasi-keluarga",
    internalName: "Paket Konsultasi Keluarga — Promo Bulan Ini (Ads visual)",
    headline: "Paket Konsultasi Keluarga — Promo Bulan Ini",
    subheadline:
      "Gabungan konsultasi hak asuh, proses cerai, dan waris/harta. Ceritakan situasinya dulu via WhatsApp — tanpa tekanan.",
    heroImageUrl: "/lp/promo-konsultasi-keluarga/banner.jpg",
    campaignNote: "Template ads visual ala Prestige — ganti gambar & copy di admin.",
    whatsappNumberOverride: null,
    whatsappPrefill:
      "Halo Legal Sakinah, saya tertarik Paket Konsultasi Keluarga (promo bulan ini).",
    primaryCtaText: "Konsultasi via WhatsApp",
    themeVariant: "visual",
    status: "published",
    noindex: true,
    blocks: [
      {
        blockType: "image_cards",
        sortOrder: 0,
        isVisible: true,
        content: {
          cards: [
            {
              imageUrl: "/lp/promo-konsultasi-keluarga/card-hak-asuh.jpg",
            },
            {
              imageUrl: "/lp/promo-konsultasi-keluarga/card-cerai.jpg",
            },
            {
              imageUrl: "/lp/promo-konsultasi-keluarga/card-waris.jpg",
            },
          ],
        },
      },
      {
        blockType: "cta",
        sortOrder: 1,
        isVisible: true,
        content: {
          title: "Siap mulai dari satu pesan?",
          description:
            "Kirim situasi singkat Anda. Tim kami bantu arahkan opsi yang realistis sebelum Anda memutuskan apa pun.",
          ctaText: "Konsultasi Sekarang via WhatsApp",
        },
      },
    ],
  },
];

function isPublished(lp: LandingPageRecord): boolean {
  return lp.status === "published";
}

export function getPublishedLandingPage(
  slug: string
): LandingPageRecord | null {
  return landingPages.find((lp) => lp.slug === slug && isPublished(lp)) ?? null;
}

export function getPublishedLandingPageSlugs(): string[] {
  return landingPages.filter(isPublished).map((lp) => lp.slug);
}

/** Blok yang benar-benar dirender, sudah terurut dan tersaring visibilitasnya. */
export function getVisibleBlocks(lp: LandingPageRecord): LandingPageBlock[] {
  return lp.blocks
    .filter((block) => block.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
