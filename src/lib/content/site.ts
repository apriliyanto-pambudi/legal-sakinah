/**
 * Pengaturan situs — nilai dummy Tahap 3.
 * Ketika CMS siap (Tahap 5), baca dari tabel site_settings.
 */

export const siteConfig = {
  name: "Legal Sakinah Indonesia",
  /** Nama pendek untuk header sempit / mobile */
  shortName: "Legal Sakinah",
  motto: "Amanah Menuntaskan",
  tagline: "Konsultasi & Pendampingan Hukum Keluarga",
  description:
    "Legal Sakinah Indonesia adalah firma hukum yang berfokus pada hukum keluarga: perceraian, hak asuh anak, nafkah, harta bersama, isbat nikah, waris, dan perlindungan KDRT. Kami hadir untuk mendampingi Anda dengan profesional dan penuh empati — Amanah Menuntaskan.",
  /** Harga indikatif semua area praktik — final tergantung kompleksitas perkara */
  startingPriceLabel: "Mulai dari Rp. 8.000.000",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  waNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890",
  waPrefill:
    process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ??
    "Halo Legal Sakinah Indonesia, saya ingin konsultasi hukum keluarga.",
  /** Lokasi kantor — [TBD] dari klien */
  address: "Jakarta Selatan, DKI Jakarta — [TBD]",
  email: "info@legalsakinah.id", // [TBD]
  officeHours: "Senin–Jumat, 09.00–17.00 WIB",
  socialLinks: {
    instagram: "", // [TBD]
    facebook: "", // [TBD]
  },
} as const;
