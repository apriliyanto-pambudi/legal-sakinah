/**
 * Data layanan Legal Sakinah — konten dummy untuk Tahap 3.
 * Ketika CMS siap (Tahap 5), ganti dengan query DB:
 *   import { getPublishedServices } from "@/server/db/queries/services";
 */

export interface Service {
  slug: string;
  title: string;
  icon: string; // Nama ikon Lucide
  summary: string;
  content: string; // HTML tersanitasi — boleh diganti dengan rich text CMS
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
}

export const services: Service[] = [
  {
    slug: "perceraian",
    title: "Proses Perceraian",
    icon: "Scale",
    summary:
      "Pendampingan hukum proses cerai talak dan cerai gugat di Pengadilan Agama maupun Pengadilan Negeri, dengan pendekatan yang terukur dan menghormati kondisi klien.",
    content: `
      <p>Perceraian adalah salah satu proses hukum yang paling berdampak pada seluruh aspek kehidupan seseorang. Tim Legal Sakinah memahami bahwa di balik setiap berkas perkara terdapat manusia yang sedang menghadapi masa sulit.</p>
      <p>Kami mendampingi klien mulai dari konsultasi awal, penyusunan surat gugatan atau permohonan, mediasi wajib, sidang di pengadilan, hingga putusan berkekuatan hukum tetap.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Cerai gugat (gugatan dari istri) di Pengadilan Agama</li>
        <li>Cerai talak (permohonan dari suami) di Pengadilan Agama</li>
        <li>Perceraian bagi pasangan non-Muslim di Pengadilan Negeri</li>
        <li>Pembuatan akta cerai dan dokumen pascaperceraian</li>
      </ul>
      <p class="disclaimer"><em>Informasi di halaman ini bersifat umum. Hasil setiap perkara bergantung pada fakta dan bukti yang ada. Kami tidak memberikan jaminan hasil hukum.</em></p>
    `,
    seoTitle: "Layanan Proses Perceraian — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum perceraian di Pengadilan Agama dan Pengadilan Negeri. Konsultasikan situasi Anda bersama advokat berpengalaman Legal Sakinah.",
    sortOrder: 1,
  },
  {
    slug: "hak-asuh-anak",
    title: "Hak Asuh Anak",
    icon: "Heart",
    summary:
      "Pendampingan permohonan hak asuh anak (hadhanah) dan hak kunjung pasca perceraian, mengutamakan kepentingan terbaik anak.",
    content: `
      <p>Sengketa hak asuh anak adalah perkara yang paling membutuhkan kehati-hatian dan empati. Kepentingan terbaik anak selalu menjadi pertimbangan utama pengadilan, dan kami hadir untuk memastikan hak-hak anak terlindungi.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Permohonan hadhanah (hak asuh anak di bawah umur)</li>
        <li>Pengaturan hak kunjung (visiting right)</li>
        <li>Gugatan perubahan hak asuh jika kondisi berubah</li>
        <li>Penyelesaian sengketa hak asuh melalui mediasi</li>
      </ul>
      <p class="disclaimer"><em>Informasi ini bersifat umum dan bukan pengganti konsultasi hukum. Keputusan pengadilan bergantung pada fakta konkret setiap kasus.</em></p>
    `,
    seoTitle: "Layanan Hak Asuh Anak — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum permohonan hak asuh anak (hadhanah) dan hak kunjung. Kepentingan terbaik anak sebagai prioritas.",
    sortOrder: 2,
  },
  {
    slug: "nafkah-harta-bersama",
    title: "Nafkah & Harta Bersama",
    icon: "Landmark",
    summary:
      "Penyelesaian pembagian harta bersama (gono-gini), nafkah iddah, nafkah anak, dan hak finansial lain pascaperceraian.",
    content: `
      <p>Persoalan finansial sering menjadi sumber konflik terbesar pascaperceraian. Legal Sakinah membantu klien memahami hak dan kewajiban hukum terkait harta bersama dan nafkah secara jelas.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Gugatan pembagian harta bersama (gono-gini)</li>
        <li>Permohonan nafkah iddah dan nafkah mut'ah</li>
        <li>Penentuan nafkah anak (alimentasi)</li>
        <li>Perjanjian pranikah (prenuptial agreement) untuk kejelasan sejak awal</li>
      </ul>
      <p class="disclaimer"><em>Informasi di halaman ini bersifat umum. Besaran hak finansial bergantung pada fakta perkawinan dan kemampuan pihak yang berkewajiban.</em></p>
    `,
    seoTitle: "Layanan Nafkah & Harta Bersama — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum pembagian harta bersama, nafkah iddah, dan nafkah anak pasca perceraian.",
    sortOrder: 3,
  },
  {
    slug: "isbat-nikah",
    title: "Isbat Nikah",
    icon: "FileText",
    summary:
      "Permohonan pengesahan pernikahan yang tidak dicatatkan secara resmi, agar memiliki kekuatan hukum dan hak sipil yang dilindungi.",
    content: `
      <p>Pernikahan yang tidak dicatatkan di Kantor Urusan Agama (KUA) tidak memiliki kekuatan hukum dan menimbulkan masalah bagi anak maupun pasangan dalam mengurus dokumen kependudukan, hak waris, dan hak sosial lainnya.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Pengajuan permohonan isbat nikah di Pengadilan Agama</li>
        <li>Konsultasi syarat dan dokumen yang dibutuhkan</li>
        <li>Pendampingan sidang hingga penetapan</li>
        <li>Pengurusan dokumen kependudukan pasca-isbat</li>
      </ul>
      <p class="disclaimer"><em>Diterimanya permohonan isbat nikah bergantung pada pemenuhan syarat hukum yang berlaku. Konsultasikan situasi Anda terlebih dahulu.</em></p>
    `,
    seoTitle: "Layanan Isbat Nikah — Legal Sakinah",
    seoDescription:
      "Pengesahan pernikahan yang tidak tercatat melalui permohonan isbat nikah di Pengadilan Agama.",
    sortOrder: 4,
  },
  {
    slug: "waris-keluarga",
    title: "Waris Keluarga",
    icon: "Users",
    summary:
      "Pendampingan penyelesaian sengketa waris dan pembagian harta warisan sesuai hukum Islam maupun hukum perdata, termasuk penetapan ahli waris.",
    content: `
      <p>Persoalan waris sering muncul di saat keluarga sedang berduka. Sengketa yang tidak diselesaikan dengan tepat dapat memecah hubungan keluarga selama bertahun-tahun. Kami hadir untuk membantu menemukan jalan keluar yang adil.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Penetapan ahli waris di Pengadilan Agama</li>
        <li>Sengketa pembagian harta waris</li>
        <li>Pendampingan pembagian waris secara kekeluargaan (akta notaris)</li>
        <li>Konsultasi hukum waris Islam (faraid)</li>
      </ul>
      <p class="disclaimer"><em>Informasi ini bersifat umum. Pembagian waris bergantung pada fakta dan dokumen perkawinan serta status ahli waris yang dapat dibuktikan.</em></p>
    `,
    seoTitle: "Layanan Waris Keluarga — Legal Sakinah",
    seoDescription:
      "Pendampingan sengketa waris dan pembagian harta warisan, serta penetapan ahli waris di Pengadilan Agama.",
    sortOrder: 5,
  },
  {
    slug: "kdrt-perlindungan-hukum",
    title: "KDRT & Perlindungan Hukum",
    icon: "Shield",
    summary:
      "Pendampingan korban kekerasan dalam rumah tangga (KDRT) untuk memperoleh perlindungan hukum, pelaporan, dan penyelesaian perkara.",
    content: `
      <p>Kekerasan dalam rumah tangga adalah pelanggaran hak asasi manusia yang diatur dalam UU No. 23 Tahun 2004. Korban berhak mendapatkan perlindungan dan keadilan. Kami siap mendampingi dengan penuh kerahasiaan dan empati.</p>
      <h3>Yang kami bantu</h3>
      <ul>
        <li>Konsultasi awal dan pemahaman hak-hak korban KDRT</li>
        <li>Pendampingan pelaporan ke aparat penegak hukum</li>
        <li>Permohonan perlindungan sementara (protection order)</li>
        <li>Pendampingan proses persidangan perkara KDRT</li>
      </ul>
      <p class="disclaimer"><em>Jika Anda dalam situasi darurat, segera hubungi 119 ext 8 (hotline KDRT nasional) atau 112. Kami siap mendampingi pada tahap hukumnya.</em></p>
    `,
    seoTitle: "Layanan KDRT & Perlindungan Hukum — Legal Sakinah",
    seoDescription:
      "Pendampingan hukum korban KDRT: perlindungan, pelaporan, dan persidangan. Penanganan penuh kerahasiaan dan empati.",
    sortOrder: 6,
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getPublishedServices(): Service[] {
  return [...services].sort((a, b) => a.sortOrder - b.sortOrder);
}
