/**
 * Data tim Legal Sakinah — konten dummy Tahap 3.
 * Swap dengan query CMS di Tahap 5.
 */

/** Legacy labels — masih dibaca dari DB lama. */
export type PhotoFocus = "top" | "center" | "bottom";

export interface TeamMember {
  slug: string;
  name: string;
  roleTitle: string;
  photoUrl?: string; // Akan diisi saat ada foto asli
  /**
   * Posisi vertikal crop (0 = atas, 50 = tengah, 100 = bawah).
   * Disimpan di kolom photo_focus sebagai angka atau label lama.
   */
  photoFocus?: number | PhotoFocus;
  bio: string;
  expertise: string[];
  sortOrder: number;
}

/** 0–100 untuk CSS object-position Y. */
export function parsePhotoPosition(value: unknown): number {
  if (value === "top") return 0;
  if (value === "bottom") return 100;
  if (value === "center") return 50;
  const n = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (Number.isFinite(n)) return Math.min(100, Math.max(0, Math.round(n)));
  return 50;
}

export function photoObjectPosition(focus?: string | number | null): string {
  return `center ${parsePhotoPosition(focus)}%`;
}

/** @deprecated pakai photoObjectPosition — tetap ada agar import lama tidak pecah. */
export function photoFocusObjectClass(focus?: string | null): string {
  const pos = parsePhotoPosition(focus);
  if (pos <= 25) return "object-top";
  if (pos >= 75) return "object-bottom";
  return "object-center";
}

export function parsePhotoFocus(value: unknown): PhotoFocus {
  if (value === "top" || value === "bottom" || value === "center") return value;
  const pos = parsePhotoPosition(value);
  if (pos <= 25) return "top";
  if (pos >= 75) return "bottom";
  return "center";
}

export const teamMembers: TeamMember[] = [
  {
    slug: "ahmad-fauzan",
    name: "Ahmad Fauzan, S.H., M.H.",
    roleTitle: "Pendiri & Advokat Senior",
    bio: "Berpengalaman lebih dari satu dekade dalam pendampingan perkara hukum keluarga di Pengadilan Agama dan Pengadilan Negeri di seluruh Indonesia. Meraih gelar Magister Hukum dengan spesialisasi Hukum Islam dan Keluarga. Dikenal karena pendekatan yang tenang, empatik, dan berorientasi pada penyelesaian terbaik bagi klien.",
    expertise: ["Perceraian", "Hak Asuh Anak", "Waris Keluarga", "Isbat Nikah"],
    sortOrder: 1,
  },
  {
    slug: "siti-rahmawati",
    name: "Siti Rahmawati, S.H.",
    roleTitle: "Advokat",
    bio: "Fokus pada perkara KDRT dan perlindungan hak perempuan dalam hukum keluarga. Aktif bekerja sama dengan lembaga bantuan hukum dan organisasi pendukung korban. Mengedepankan pendekatan berbasis trauma dalam setiap penanganan perkara.",
    expertise: ["KDRT & Perlindungan Hukum", "Nafkah & Harta Bersama", "Hak Asuh Anak"],
    sortOrder: 2,
  },
  {
    slug: "budi-santoso",
    name: "Budi Santoso, S.H.",
    roleTitle: "Advokat",
    bio: "Spesialis perkara harta bersama, perjanjian pranikah, dan sengketa waris keluarga. Memiliki latar belakang kuat di bidang hukum perdata dan hukum adat, serta pengalaman mediasi perkara keluarga di luar pengadilan.",
    expertise: ["Nafkah & Harta Bersama", "Waris Keluarga", "Perceraian"],
    sortOrder: 3,
  },
];

export function getPublishedTeam(): TeamMember[] {
  return [...teamMembers].sort((a, b) => a.sortOrder - b.sortOrder);
}
