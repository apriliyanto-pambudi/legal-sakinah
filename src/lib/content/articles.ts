/**
 * Artikel edukasi — konten dummy Tahap awal.
 * PRD: modul artikel opsional v1; schema `articles` sudah ada di DB.
 * Nanti diganti query CMS published.
 */

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string; // ISO date
  category: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const articles: Article[] = [
  {
    slug: "memahami-proses-perceraian-di-pengadilan-agama",
    title: "Memahami Proses Perceraian di Pengadilan Agama",
    excerpt:
      "Ringkasan tahapan yang biasanya dilalui pasangan Muslim saat mengajukan perceraian di Pengadilan Agama — dari pendaftaran hingga putusan.",
    category: "Perceraian",
    publishedAt: "2026-09-12",
    seoTitle: "Proses Perceraian di Pengadilan Agama — Legal Sakinah",
    seoDescription:
      "Penjelasan umum tahapan perceraian di Pengadilan Agama. Bukan nasihat hukum; konsultasikan situasi Anda dengan advokat.",
    content: `
      <p>Perceraian di Pengadilan Agama mengikuti prosedur yang diatur dalam peraturan perundang-undangan. Setiap perkara memiliki fakta unik, sehingga langkah konkret bisa berbeda.</p>
      <h2>Tahapan yang umumnya dilalui</h2>
      <ol>
        <li>Konsultasi awal dan pengumpulan dokumen</li>
        <li>Pendaftaran perkara di Pengadilan Agama yang berwenang</li>
        <li>Mediasi wajib antara para pihak</li>
        <li>Sidang pembuktian bila mediasi tidak berhasil</li>
        <li>Putusan dan proses selanjutnya sesuai ketentuan</li>
      </ol>
      <p>Informasi ini bersifat umum dan tidak menggantikan konsultasi dengan advokat. Legal Sakinah siap mendampingi Anda memahami pilihan yang tersedia untuk situasi spesifik Anda.</p>
    `,
  },
  {
    slug: "hak-asuh-anak-pasca-perceraian",
    title: "Hak Asuh Anak Pasca Perceraian: Apa yang Perlu Dipahami",
    excerpt:
      "Prinsip kepentingan terbaik anak menjadi acuan utama. Berikut gambaran umum isu hak asuh (hadhanah) dan hak kunjung.",
    category: "Hak Asuh",
    publishedAt: "2026-08-28",
    seoTitle: "Hak Asuh Anak Pasca Perceraian — Legal Sakinah",
    seoDescription:
      "Gambaran umum hak asuh anak setelah perceraian. Konsultasikan kasus Anda untuk saran yang relevan.",
    content: `
      <p>Dalam perkara yang melibatkan anak, fokus utama adalah kepentingan terbaik anak — bukan semata keinginan orang tua.</p>
      <h2>Hal yang sering menjadi perhatian</h2>
      <ul>
        <li>Siapa yang lebih mampu memberikan pengasuhan yang stabil</li>
        <li>Hak kunjung orang tua yang tidak tinggal bersama anak</li>
        <li>Nafkah anak dan kebutuhan pendidikan</li>
      </ul>
      <p>Setiap situasi berbeda. Tim Legal Sakinah membantu Anda memahami kerangka hukum yang berlaku tanpa menjanjikan hasil tertentu.</p>
    `,
  },
  {
    slug: "isbat-nikah-mengapa-penting",
    title: "Isbat Nikah: Mengapa Pengesahan Pernikahan Itu Penting",
    excerpt:
      "Pernikahan yang belum tercatat dapat menyulitkan hak sipil. Isbat nikah adalah salah satu jalur untuk memperoleh kepastian hukum.",
    category: "Isbat Nikah",
    publishedAt: "2026-07-15",
    seoTitle: "Isbat Nikah dan Kepastian Hukum — Legal Sakinah",
    seoDescription:
      "Penjelasan umum tentang isbat nikah dan pentingnya pencatatan. Bukan nasihat hukum individual.",
    content: `
      <p>Isbat nikah adalah permohonan pengesahan pernikahan yang diajukan ke Pengadilan Agama agar pernikahan memiliki kekuatan hukum yang lebih jelas.</p>
      <p>Tanpa pencatatan yang memadai, sejumlah urusan administratif — seperti hak waris, status anak, atau dokumen sipil — bisa menjadi lebih rumit.</p>
      <p>Jika Anda mempertimbangkan isbat nikah, konsultasikan dokumen dan kronologi pernikahan Anda dengan advokat agar langkah yang diambil sesuai kondisi aktual.</p>
    `,
  },
];

export function getPublishedArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}
