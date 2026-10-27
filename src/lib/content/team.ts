/**
 * Data tim Legal Sakinah — konten dummy Tahap 3.
 * Swap dengan query CMS di Tahap 5.
 */

export interface TeamMember {
  slug: string;
  name: string;
  roleTitle: string;
  photoUrl?: string; // Akan diisi saat ada foto asli
  bio: string;
  expertise: string[];
  sortOrder: number;
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
