/**
 * Testimoni anonim — tanpa nama, tanpa detail perkara.
 * Hanya menampilkan sentimen umum pengalaman klien.
 * PRD: tidak ada klaim "pasti menang" atau jaminan hasil.
 */

export interface Testimonial {
  id: string;
  quote: string;
  /**
   * Identitas samar — tidak mengidentifikasi individu.
   * Contoh: "Ibu rumah tangga, Jakarta" atau "Klien, Jawa Barat"
   */
  attribution: string;
  serviceSlug?: string; // Layanan terkait (opsional)
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Saya tidak tahu harus mulai dari mana. Tim Legal Sakinah meluangkan waktu menjelaskan proses dengan bahasa yang mudah dipahami. Saya merasa didampingi, bukan sekadar dilayani.",
    attribution: "Klien, Jawa Barat",
    serviceSlug: "perceraian",
  },
  {
    id: "t2",
    quote:
      "Yang saya hargai adalah kejujurannya — mereka tidak berjanji hasil yang pasti, tapi menjelaskan apa yang realistis. Itu justru membuat saya lebih percaya.",
    attribution: "Klien, DKI Jakarta",
    serviceSlug: "hak-asuh-anak",
  },
  {
    id: "t3",
    quote:
      "Proses isbat nikah yang saya kira rumit ternyata bisa dijalani dengan bimbingan yang tepat. Setiap langkah dijelaskan dengan sabar.",
    attribution: "Klien, Jawa Tengah",
    serviceSlug: "isbat-nikah",
  },
  {
    id: "t4",
    quote:
      "Saya sangat menghargai kerahasiaan yang dijaga selama proses berlangsung. Tidak mudah menceritakan situasi keluarga kepada orang lain.",
    attribution: "Klien, Banten",
    serviceSlug: "kdrt-perlindungan-hukum",
  },
  {
    id: "t5",
    quote:
      "Konsultasi awalnya sudah membuat saya lebih tenang. Pilihan hukumnya dijelaskan satu per satu, termasuk risiko yang mungkin muncul.",
    attribution: "Klien, Jawa Timur",
    serviceSlug: "nafkah-harta-bersama",
  },
  {
    id: "t6",
    quote:
      "Komunikasi responsif dan tidak menghakimi. Saya merasa situasi keluarga saya benar-benar didengar sebelum ada saran langkah.",
    attribution: "Klien, Sumatera Utara",
    serviceSlug: "perceraian",
  },
  {
    id: "t7",
    quote:
      "Dari dokumen hingga jadwal sidang, semuanya diarahkan dengan rapi. Saya tidak merasa sendirian menghadapi proses yang panjang.",
    attribution: "Klien, Sulawesi Selatan",
    serviceSlug: "waris",
  },
];

export function getTestimonials(): Testimonial[] {
  return testimonials;
}
