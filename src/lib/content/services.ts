/**
 * Data layanan Legal Sakinah.
 * Harga indikatif dari daftar klien — final tergantung kompleksitas.
 */

export type ServiceCategory = "litigasi" | "non-litigasi";

export interface Service {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
  category: ServiceCategory;
  /** null = non-litigasi / hubungi untuk penawaran */
  priceLabel: string | null;
}

const disclaimer = `<p class="disclaimer"><em>Biaya bersifat indikatif &ldquo;mulai dari&rdquo;. Nilai akhir menyesuaikan kompleksitas perkara, lingkup pendampingan, dan kesepakatan setelah konsultasi. Informasi di halaman ini bersifat umum dan bukan nasihat hukum.</em></p>`;

export const services: Service[] = [
  {
    slug: "perceraian-muslim",
    title: "Perceraian Muslim",
    icon: "Scale",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 5.000.000",
    summary:
      "Pendampingan cerai talak dan cerai gugat di Pengadilan Agama, dengan pendekatan yang terukur dan menghormati kondisi klien.",
    content: `
      <p>Kami mendampingi proses perceraian di Pengadilan Agama mulai dari konsultasi, penyusunan berkas, mediasi, hingga putusan.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Cerai gugat dan cerai talak</li>
        <li>Persiapan dokumen dan strategi proses</li>
        <li>Pendampingan sidang hingga akta cerai</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Perceraian Muslim — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum perceraian Muslim di Pengadilan Agama. Mulai dari Rp 5.000.000.",
    sortOrder: 1,
  },
  {
    slug: "perceraian-non-muslim",
    title: "Perceraian Non-Muslim",
    icon: "Scale",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 8.000.000",
    summary:
      "Pendampingan perceraian di Pengadilan Negeri untuk pasangan non-Muslim, dengan proses yang jelas dan komunikatif.",
    content: `
      <p>Proses perceraian non-Muslim ditempuh melalui Pengadilan Negeri. Kami bantu memetakan langkah dan mendampingi hingga putusan.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Gugatan perceraian di Pengadilan Negeri</li>
        <li>Penyiapan bukti dan dokumen</li>
        <li>Pendampingan sidang dan pascaputusan</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Perceraian Non-Muslim — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum perceraian non-Muslim di Pengadilan Negeri. Mulai dari Rp 8.000.000.",
    sortOrder: 2,
  },
  {
    slug: "perceraian-hak-asuh",
    title: "Perceraian & Hak Asuh Anak",
    icon: "Heart",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 10.000.000",
    summary:
      "Paket pendampingan perceraian yang menyertakan permohonan hak asuh anak (hadhanah), dengan kepentingan terbaik anak sebagai prioritas.",
    content: `
      <p>Ketika perceraian melibatkan anak, prosesnya membutuhkan kehati-hatian ekstra. Kami mendampingi perkara perceraian sekaligus pengaturan hak asuh.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Proses perceraian yang terkait hak asuh</li>
        <li>Permohonan hadhanah dan hak kunjung</li>
        <li>Pendampingan mediasi dan sidang</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Perceraian & Hak Asuh Anak — Legal Sakinah",
    seoDescription:
      "Pendampingan perceraian sekaligus hak asuh anak (hadhanah). Mulai dari Rp 10.000.000.",
    sortOrder: 3,
  },
  {
    slug: "harta-bersama",
    title: "Harta Bersama (Gono-Gini)",
    icon: "Landmark",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 20.000.000",
    summary:
      "Penyelesaian pembagian harta bersama (gono-gini) secara litigasi, dengan pemetaan aset dan strategi yang realistis.",
    content: `
      <p>Persoalan harta bersama sering menjadi sumber konflik terbesar pascaperceraian. Kami bantu Anda memahami hak dan menempuh proses yang terukur.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Gugatan pembagian harta bersama</li>
        <li>Pemetaan aset dan dokumen pendukung</li>
        <li>Negosiasi dan litigasi di pengadilan</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Harta Bersama (Gono-Gini) — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum pembagian harta bersama / gono-gini. Mulai dari Rp 20.000.000.",
    sortOrder: 4,
  },
  {
    slug: "penetapan-ahli-waris",
    title: "Penetapan Ahli Waris",
    icon: "Users",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 10.000.000",
    summary:
      "Permohonan penetapan ahli waris di pengadilan agar status ahli waris memiliki kekuatan hukum.",
    content: `
      <p>Penetapan ahli waris diperlukan untuk kejelasan hak waris dan pengurusan aset. Kami dampingi dari berkas hingga penetapan.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Permohonan penetapan ahli waris</li>
        <li>Penyiapan dokumen dan silsilah</li>
        <li>Pendampingan sidang penetapan</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Penetapan Ahli Waris — Legal Sakinah",
    seoDescription:
      "Pendampingan permohonan penetapan ahli waris. Mulai dari Rp 10.000.000.",
    sortOrder: 5,
  },
  {
    slug: "sengketa-waris",
    title: "Sengketa Waris",
    icon: "Users",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 20.000.000",
    summary:
      "Pendampingan penyelesaian sengketa pembagian harta warisan sesuai hukum Islam maupun hukum perdata.",
    content: `
      <p>Sengketa waris sering muncul di saat keluarga sedang berduka. Kami bantu mencari jalan keluar yang adil dan terukur secara hukum.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Gugatan / penyelesaian sengketa waris</li>
        <li>Analisis pembagian menurut hukum yang berlaku</li>
        <li>Mediasi dan litigasi</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Sengketa Waris — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum sengketa waris keluarga. Mulai dari Rp 20.000.000.",
    sortOrder: 6,
  },
  {
    slug: "isbat-nikah",
    title: "Isbat Nikah",
    icon: "FileText",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 8.000.000",
    summary:
      "Pengesahan pernikahan yang tidak dicatatkan secara resmi agar memiliki kekuatan hukum dan hak sipil yang dilindungi.",
    content: `
      <p>Pernikahan yang tidak tercatat menimbulkan masalah dokumen dan hak sipil. Isbat nikah memberi kepastian hukum bagi pasangan dan anak.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Permohonan isbat nikah di Pengadilan Agama</li>
        <li>Konsultasi syarat dan dokumen</li>
        <li>Pendampingan sidang hingga penetapan</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Isbat Nikah — Legal Sakinah",
    seoDescription:
      "Pengesahan pernikahan melalui isbat nikah. Mulai dari Rp 8.000.000.",
    sortOrder: 7,
  },
  {
    slug: "pembatalan-perkawinan",
    title: "Pembatalan Perkawinan",
    icon: "FileText",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 15.000.000",
    summary:
      "Gugatan pembatalan perkawinan sesuai ketentuan hukum yang berlaku, dengan pendampingan hati-hati dan terukur.",
    content: `
      <p>Pembatalan perkawinan adalah proses khusus dengan syarat hukum yang ketat. Kami bantu menilai kelayakan dan mendampingi prosesnya.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Analisis dasar hukum pembatalan</li>
        <li>Penyusunan gugatan dan bukti</li>
        <li>Pendampingan sidang</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Pembatalan Perkawinan — Legal Sakinah",
    seoDescription:
      "Pendampingan gugatan pembatalan perkawinan. Mulai dari Rp 15.000.000.",
    sortOrder: 8,
  },
  {
    slug: "perwalian",
    title: "Perwalian",
    icon: "Shield",
    category: "litigasi",
    priceLabel: "Mulai dari Rp 6.000.000",
    summary:
      "Permohonan perwalian untuk kepentingan anak atau pihak yang memerlukan wali secara hukum.",
    content: `
      <p>Perwalian dibutuhkan agar kepentingan anak atau pihak yang diwakili terlindungi secara hukum. Kami dampingi proses permohonannya.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Permohonan penetapan wali</li>
        <li>Penyiapan dokumen pendukung</li>
        <li>Pendampingan di pengadilan</li>
      </ul>
      ${disclaimer}
    `,
    seoTitle: "Perwalian — Legal Sakinah",
    seoDescription:
      "Pendampingan permohonan perwalian. Mulai dari Rp 6.000.000.",
    sortOrder: 9,
  },
  {
    slug: "perjanjian-perkawinan",
    title: "Perjanjian Perkawinan",
    icon: "FileText",
    category: "non-litigasi",
    priceLabel: null,
    summary:
      "Penyusunan perjanjian perkawinan (prenup/postnup) agar hak dan kewajiban harta lebih jelas sejak awal.",
    content: `
      <p>Perjanjian perkawinan membantu kejelasan harta bersama dan terpisah. Layanan ini bersifat non-litigasi (penyusunan dokumen).</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Konsultasi ruang lingkup perjanjian</li>
        <li>Penyusunan draf prenup / postnup</li>
        <li>Reviu sebelum ditandatangani</li>
      </ul>
      <p class="disclaimer"><em>Biaya menyesuaikan lingkup dokumen. Hubungi kami untuk penawaran. Informasi bersifat umum dan bukan nasihat hukum.</em></p>
    `,
    seoTitle: "Perjanjian Perkawinan — Legal Sakinah",
    seoDescription:
      "Penyusunan perjanjian perkawinan (prenup/postnup) oleh Legal Sakinah.",
    sortOrder: 10,
  },
  {
    slug: "pembagian-harta-waris",
    title: "Pembagian Harta Waris",
    icon: "Users",
    category: "non-litigasi",
    priceLabel: null,
    summary:
      "Fasilitasi pembagian harta waris secara kekeluargaan / non-litigasi, agar kesepakatan lebih rapi dan terdokumentasi.",
    content: `
      <p>Tidak semua pembagian waris harus ke pengadilan. Kami bantu memfasilitasi pembagian secara kekeluargaan dengan dokumentasi yang jelas.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Pemetaan ahli waris dan objek waris</li>
        <li>Fasilitasi kesepakatan kekeluargaan</li>
        <li>Penyiapan dokumen kesepakatan</li>
      </ul>
      <p class="disclaimer"><em>Biaya menyesuaikan lingkup. Hubungi kami untuk penawaran. Informasi bersifat umum dan bukan nasihat hukum.</em></p>
    `,
    seoTitle: "Pembagian Harta Waris — Legal Sakinah",
    seoDescription:
      "Fasilitasi pembagian harta waris non-litigasi oleh Legal Sakinah.",
    sortOrder: 11,
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getPublishedServices(): Service[] {
  return [...services].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Meta harga/kategori dari katalog statis — untuk enrich baris CMS. */
export function getServiceCatalogMeta(slug: string) {
  const s = getServiceBySlug(slug);
  if (!s) return null;
  return {
    category: s.category,
    priceLabel: s.priceLabel,
  };
}

export function displayServicePrice(service: {
  priceLabel: string | null;
}): string {
  return service.priceLabel ?? "Hubungi untuk penawaran";
}
