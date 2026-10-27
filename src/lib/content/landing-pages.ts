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
        blockType: "hero",
        sortOrder: 0,
        isVisible: true,
        content: {
          badges: [
            "Advokat berlisensi",
            "Kerahasiaan klien terjaga",
            "Pendampingan sampai putusan",
          ],
          supportingNote:
            "Dijawab langsung oleh tim kami pada jam operasional, Senin–Jumat 09.00–17.00 WIB.",
        },
      },
      {
        blockType: "problem",
        sortOrder: 1,
        isVisible: true,
        content: {
          eyebrow: "Situasi yang Anda hadapi",
          title: "Ketika Anak Menjadi Bagian Paling Berat dari Perpisahan",
          intro:
            "Perselisihan hak asuh jarang hanya soal dokumen. Ada kekhawatiran yang menumpuk setiap hari, sementara keputusan harus diambil cepat dan tepat.",
          items: [
            "Anda takut kehilangan waktu bersama anak setelah perpisahan.",
            "Pihak lain sudah menunjuk kuasa hukum, sementara Anda belum tahu harus mulai dari mana.",
            "Anda tidak yakin dokumen dan bukti apa yang benar-benar dipertimbangkan hakim.",
            "Kesepakatan lisan soal nafkah dan jadwal bertemu anak tidak dijalankan.",
            "Anda khawatir langkah yang salah di awal akan sulit diperbaiki nanti.",
          ],
        },
      },
      {
        blockType: "solution",
        sortOrder: 2,
        isVisible: true,
        content: {
          eyebrow: "Yang kami bantu",
          title: "Pendampingan Menyeluruh untuk Perkara Hak Asuh",
          intro:
            "Kami membantu Anda memahami posisi hukum secara jujur, menyiapkan berkas dengan rapi, dan mendampingi Anda di setiap tahapan persidangan.",
          items: [
            {
              title: "Penilaian awal perkara",
              description:
                "Kami memetakan fakta, riwayat pengasuhan, dan dasar hukum yang relevan agar Anda tahu pilihan yang realistis sejak awal.",
            },
            {
              title: "Penyusunan permohonan & gugatan",
              description:
                "Penyusunan berkas hak asuh, nafkah anak, dan hak bertemu (hadhanah) sesuai kewenangan pengadilan yang tepat.",
            },
            {
              title: "Persiapan bukti & saksi",
              description:
                "Pendampingan menyiapkan dokumen, kronologi, dan keterangan saksi agar tersampaikan dengan tertib di persidangan.",
            },
            {
              title: "Upaya damai & mediasi",
              description:
                "Bila memungkinkan, kami mengupayakan kesepakatan yang menempatkan kepentingan terbaik anak lebih dulu.",
            },
            {
              title: "Pendampingan persidangan",
              description:
                "Mewakili dan mendampingi Anda pada tiap agenda sidang, hingga pembacaan putusan.",
            },
            {
              title: "Tindak lanjut putusan",
              description:
                "Penjelasan isi putusan serta langkah hukum lanjutan yang tersedia bila diperlukan.",
            },
          ],
        },
      },
      {
        blockType: "process",
        sortOrder: 3,
        isVisible: true,
        content: {
          eyebrow: "Tahapan",
          title: "Empat Langkah, Mulai dari Satu Percakapan",
          steps: [
            {
              title: "Hubungi kami via WhatsApp",
              description:
                "Ceritakan situasi Anda secara garis besar. Tidak perlu menyiapkan dokumen apa pun pada tahap ini.",
            },
            {
              title: "Konsultasi & penilaian awal",
              description:
                "Kami menjelaskan kerangka hukum yang berlaku, kemungkinan yang ada, serta apa saja yang perlu disiapkan.",
            },
            {
              title: "Persiapan berkas",
              description:
                "Tim menyusun berkas dan mengumpulkan bukti pendukung bersama Anda, lalu mendaftarkannya ke pengadilan.",
            },
            {
              title: "Pendampingan hingga putusan",
              description:
                "Kami mendampingi setiap agenda sidang dan memberi kabar perkembangan perkara secara berkala.",
            },
          ],
        },
      },
      {
        blockType: "proof",
        sortOrder: 4,
        isVisible: true,
        content: {
          eyebrow: "Mengapa Legal Sakinah",
          title: "Profesional dalam Prosedur, Manusiawi dalam Pendekatan",
          points: [
            "Fokus pada hukum keluarga: hak asuh, nafkah, perceraian, harta bersama, dan waris.",
            "Berpengalaman beracara di Pengadilan Agama maupun Pengadilan Negeri.",
            "Penjelasan tanpa istilah berbelit — Anda tahu apa yang sedang terjadi di setiap tahap.",
            "Kerahasiaan identitas dan isi perkara dijaga sepenuhnya.",
          ],
          testimonials: [
            {
              quote:
                "Saya datang dalam keadaan bingung dan takut. Yang paling membantu adalah dijelaskan apa yang realistis, bukan dijanjikan hal yang muluk.",
              attribution: "Klien pendampingan hak asuh, Jakarta",
            },
            {
              quote:
                "Setiap jadwal sidang selalu diinformasikan lebih dulu, dan saya tidak pernah merasa ditinggal sendirian di pengadilan.",
              attribution: "Klien pendampingan hukum keluarga, Bekasi",
            },
          ],
          note: "Identitas klien dan detail perkara dirahasiakan. Kutipan di atas menggambarkan pengalaman pendampingan, bukan klaim atas hasil perkara.",
        },
      },
      {
        blockType: "faq",
        sortOrder: 5,
        isVisible: true,
        content: {
          eyebrow: "Pertanyaan umum",
          title: "Hal yang Paling Sering Ditanyakan",
          items: [
            {
              question: "Apakah ibu selalu mendapatkan hak asuh anak?",
              answer:
                "Tidak otomatis. Untuk anak yang belum mumayyiz, praktik peradilan memang kerap mengutamakan ibu, tetapi hakim tetap menimbang kepentingan terbaik anak berdasarkan fakta yang dibuktikan di persidangan. Ayah juga dapat mengajukan permohonan hak asuh.",
            },
            {
              question: "Ke pengadilan mana perkara hak asuh diajukan?",
              answer:
                "Bergantung pada hukum yang berlaku bagi perkawinan Anda. Bagi yang beragama Islam umumnya melalui Pengadilan Agama, sedangkan selainnya melalui Pengadilan Negeri. Kami akan memastikan kewenangan pengadilan yang tepat pada saat konsultasi.",
            },
            {
              question: "Dokumen apa yang biasanya perlu disiapkan?",
              answer:
                "Umumnya buku nikah atau akta perkawinan, akta kelahiran anak, kartu keluarga, KTP, serta bukti-bukti pendukung terkait pengasuhan sehari-hari. Daftar rincinya menyesuaikan kondisi perkara Anda.",
            },
            {
              question: "Berapa lama proses hak asuh berlangsung?",
              answer:
                "Durasinya berbeda-beda, dipengaruhi kelengkapan berkas, jadwal pengadilan, dan apakah pihak lain hadir serta mengajukan bantahan. Kami akan menyampaikan perkiraan tahapan setelah menilai berkas Anda.",
            },
            {
              question: "Apakah hasil perkara bisa dijamin?",
              answer:
                "Tidak. Kami tidak menjanjikan hasil apa pun. Yang kami pastikan adalah persiapan berkas yang tertib, argumentasi yang berdasar, dan pendampingan yang konsisten di setiap tahapan.",
            },
            {
              question: "Apakah konsultasi saya dirahasiakan?",
              answer:
                "Ya. Isi konsultasi dan identitas Anda dijaga kerahasiaannya sebagai bagian dari kewajiban profesi advokat.",
            },
          ],
        },
      },
      {
        blockType: "cta",
        sortOrder: 6,
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
