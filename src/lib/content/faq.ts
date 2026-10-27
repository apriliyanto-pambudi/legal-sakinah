/**
 * Data FAQ Legal Sakinah — konten dummy Tahap 3.
 * Swap dengan query CMS di Tahap 5.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export const faqItems: FaqItem[] = [
  {
    id: "biaya-konsultasi",
    question: "Apakah konsultasi pertama berbayar?",
    answer:
      "Anda dapat menghubungi kami melalui WhatsApp untuk konsultasi awal. Pada tahap awal ini kami akan memahami situasi Anda dan memberikan gambaran umum mengenai proses hukum yang relevan. Untuk detail biaya pendampingan penuh, kami akan mendiskusikannya setelah memahami kebutuhan spesifik perkara Anda.",
    category: "umum",
    sortOrder: 1,
  },
  {
    id: "lama-proses-cerai",
    question: "Berapa lama proses perceraian biasanya berlangsung?",
    answer:
      "Durasi proses perceraian sangat bergantung pada beberapa faktor: apakah ada kesepakatan antar pihak, apakah ada sengketa hak asuh atau harta, serta jadwal persidangan di pengadilan setempat. Proses yang berjalan lancar umumnya memakan waktu beberapa bulan. Kami tidak dapat menjanjikan durasi tertentu karena sangat bergantung pada fakta dan dinamika masing-masing perkara.",
    category: "perceraian",
    sortOrder: 2,
  },
  {
    id: "tanpa-persetujuan-pasangan",
    question: "Bisakah bercerai tanpa persetujuan pasangan?",
    answer:
      "Ya, dalam hukum Indonesia dimungkinkan. Cerai gugat (diajukan istri) atau cerai talak (diajukan suami) dapat diproses bahkan jika salah satu pihak tidak hadir di persidangan, dengan ketentuan yang diatur oleh undang-undang. Pengadilan akan tetap memanggil pihak yang tidak hadir beberapa kali sebelum melanjutkan proses.",
    category: "perceraian",
    sortOrder: 3,
  },
  {
    id: "hak-asuh-anak-bawah-umur",
    question: "Siapa yang berhak mengasuh anak di bawah 12 tahun?",
    answer:
      "Secara umum, hukum Islam memberikan hak asuh (hadhanah) kepada ibu untuk anak yang belum mumayyiz (belum dapat membedakan baik dan buruk, umumnya di bawah 12 tahun). Namun pengadilan akan mempertimbangkan kepentingan terbaik anak, termasuk kondisi dan kemampuan masing-masing pihak. Tidak ada jaminan mutlak karena setiap kasus dievaluasi secara individual.",
    category: "hak-asuh",
    sortOrder: 4,
  },
  {
    id: "harta-bersama",
    question: "Apakah semua harta selama pernikahan dibagi rata?",
    answer:
      "Harta bersama (gono-gini) umumnya dibagi secara adil, tetapi tidak selalu berarti 50:50. Pengadilan mempertimbangkan kontribusi masing-masing pihak dan faktor lain yang relevan. Harta bawaan (yang dimiliki sebelum menikah atau diperoleh dari warisan/hibah selama pernikahan) umumnya bukan termasuk harta bersama, meski ini bergantung pada ada/tidaknya perjanjian pranikah.",
    category: "harta",
    sortOrder: 5,
  },
  {
    id: "dokumen-yang-dibutuhkan",
    question: "Dokumen apa saja yang dibutuhkan untuk memulai proses perceraian?",
    answer:
      "Dokumen dasar yang umumnya dibutuhkan antara lain: buku nikah asli, KTP kedua pihak, Kartu Keluarga, dan akta kelahiran anak (jika ada). Dokumen tambahan mungkin diperlukan tergantung kompleksitas perkara. Kami akan memandu Anda dalam menyiapkan kelengkapan dokumen selama proses konsultasi.",
    category: "perceraian",
    sortOrder: 6,
  },
  {
    id: "nafkah-anak",
    question: "Bagaimana penentuan besaran nafkah anak?",
    answer:
      "Tidak ada angka pasti yang ditetapkan undang-undang. Pengadilan mempertimbangkan kemampuan ekonomi orang tua yang berkewajiban (umumnya ayah) dan kebutuhan riil anak. Tim kami dapat membantu Anda memahami argumen hukum yang relevan untuk situasi Anda, namun kami tidak dapat menjanjikan besaran tertentu karena keputusan ada di tangan hakim.",
    category: "nafkah",
    sortOrder: 7,
  },
  {
    id: "isbat-nikah-syarat",
    question: "Apa syarat utama mengajukan isbat nikah?",
    answer:
      "Secara umum, permohonan isbat nikah dapat diajukan jika pernikahan dilaksanakan sesuai syarat dan rukun nikah menurut hukum Islam, tetapi tidak dicatatkan. Kondisi yang mendorong pengajuan antara lain: keperluan pengurusan akta cerai, pengurusan hak waris, atau pendaftaran anak. Setiap kasus memiliki syarat spesifik — konsultasikan situasi Anda terlebih dahulu.",
    category: "isbat-nikah",
    sortOrder: 8,
  },
];

export function getFaqByCategory(category?: string): FaqItem[] {
  const sorted = [...faqItems].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!category) return sorted;
  return sorted.filter((f) => f.category === category);
}

export function getPublishedFaqs(): FaqItem[] {
  return [...faqItems].sort((a, b) => a.sortOrder - b.sortOrder);
}
