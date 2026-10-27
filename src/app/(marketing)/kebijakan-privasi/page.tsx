import type { Metadata } from "next";
import PageHero from "@/components/marketing/PageHero";
import CmsHtml from "@/components/shared/CmsHtml";
import { getPublicPage, getPublicSiteConfig } from "@/lib/content/cms";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([
    getPublicPage("kebijakan-privasi"),
    getPublicSiteConfig(),
  ]);

  return {
    title: page?.seoTitle || page?.title || `Kebijakan Privasi — ${site.name}`,
    description:
      page?.seoDescription ||
      "Kebijakan privasi Legal Sakinah: bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengunjung website.",
    robots: { index: true, follow: true },
    openGraph: {
      title: page?.seoTitle || page?.title || `Kebijakan Privasi — ${site.name}`,
      description: page?.seoDescription || "Kebijakan privasi Legal Sakinah.",
      url: `${site.url}/kebijakan-privasi`,
      siteName: site.name,
      locale: "id_ID",
      type: "website",
    },
  };
}

export default async function KebijakanPrivasiPage() {
  const [page, site] = await Promise.all([
    getPublicPage("kebijakan-privasi"),
    getPublicSiteConfig(),
  ]);
  const cmsHtml = page?.content?.trim();
  const lastUpdated = "7 September 2026"; // [TBD] — perbarui saat konten final

  return (
    <>
      <PageHero
        compact
        title={page?.title || "Kebijakan Privasi"}
        description={`Terakhir diperbarui: ${lastUpdated}`}
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Kebijakan Privasi" },
        ]}
      />

      {cmsHtml ? <CmsHtml html={cmsHtml} /> : null}

      {/* Konten fallback */}
      {!cmsHtml ? (
      <section className="py-14 md:py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-slate max-w-none text-text leading-relaxed space-y-8">

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">1. Pendahuluan</h2>
              <p className="text-text-muted">
                Legal Sakinah (&ldquo;kami&rdquo;) berkomitmen untuk melindungi privasi pengunjung website ini. Kebijakan Privasi ini menjelaskan jenis data yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak Anda terkait data tersebut.
              </p>
              <p className="text-text-muted mt-3">
                Dengan mengakses website ini, Anda menyetujui kebijakan yang tertuang di halaman ini. Kami dapat memperbarui kebijakan ini dari waktu ke waktu; perubahan signifikan akan kami informasikan melalui website.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">2. Data yang Kami Kumpulkan</h2>
              <p className="text-text-muted mb-3">Website ini mengumpulkan data dalam kategori berikut:</p>
              <ul className="list-disc pl-5 space-y-2 text-text-muted">
                <li>
                  <strong className="text-text">Data analitik agregat</strong> — melalui Google Analytics 4 (GA4), kami mengumpulkan data penggunaan website secara anonim (halaman yang dikunjungi, durasi kunjungan, sumber traffic). GA4 memproses data sesuai Kebijakan Privasi Google.
                </li>
                <li>
                  <strong className="text-text">Metadata klik CTA</strong> — saat Anda mengklik tombol WhatsApp, kami mencatat metadata seperti halaman asal, label tombol, parameter UTM (sumber iklan), timestamp, dan jenis perangkat. <strong className="text-text">Kami tidak menyimpan nomor telepon, nama, atau isi percakapan WhatsApp Anda.</strong>
                </li>
                <li>
                  <strong className="text-text">IP yang dianonimkan</strong> — untuk keperluan pencegahan penyalahgunaan, alamat IP disimpan dalam bentuk hash (terenkripsi), bukan IP mentah.
                </li>
                <li>
                  <strong className="text-text">Parameter UTM</strong> — jika Anda mengunjungi website melalui iklan, parameter UTM (source, medium, campaign) disimpan sementara di browser Anda (sessionStorage) dan dikirim bersama event klik CTA. Parameter ini hanya menunjukkan asal traffic iklan.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">3. Tujuan Penggunaan Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-text-muted">
                <li>Memahami performa halaman dan iklan untuk meningkatkan efektivitas layanan.</li>
                <li>Mengidentifikasi halaman atau kampanye yang menghasilkan minat konsultasi terbesar.</li>
                <li>Mencegah penyalahgunaan sistem.</li>
              </ul>
              <p className="text-text-muted mt-3">
                Kami tidak menggunakan data ini untuk membuat profil pengunjung secara individual atau untuk keperluan pemasaran pihak ketiga.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">4. Penyimpanan & Keamanan Data</h2>
              <p className="text-text-muted">
                Data disimpan di server di Indonesia dengan enkripsi standar industri. Akses ke data dibatasi hanya pada staf internal yang membutuhkannya untuk keperluan operasional. Kami menerapkan langkah-langkah teknis dan organisasional yang wajar untuk mencegah akses tidak sah.
              </p>
              <p className="text-text-muted mt-3">
                Data analitik klik CTA disimpan selama [TBD] sejak pengumpulan dan kemudian dihapus secara otomatis.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">5. Berbagi Data dengan Pihak Ketiga</h2>
              <p className="text-text-muted">
                Kami tidak menjual atau menyewakan data pengunjung kepada pihak ketiga. Data dapat dibagikan kepada:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-muted mt-3">
                <li><strong className="text-text">Google Analytics</strong> — untuk pengukuran traffic website (data anonim).</li>
                <li><strong className="text-text">Penyedia hosting</strong> — server yang menyimpan website dan database.</li>
                <li><strong className="text-text">Otoritas hukum</strong> — jika diwajibkan oleh peraturan perundang-undangan yang berlaku.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">6. Cookie</h2>
              <p className="text-text-muted">
                Website ini menggunakan cookie fungsional yang diperlukan untuk operasi website (misalnya session admin) dan cookie analitik dari Google Analytics. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">7. Hak Anda</h2>
              <p className="text-text-muted">
                Sesuai dengan peraturan perlindungan data yang berlaku, Anda memiliki hak untuk meminta akses, koreksi, atau penghapusan data yang terkait dengan Anda (sejauh data tersebut dapat diidentifikasi). Untuk permintaan tersebut, hubungi kami di:
              </p>
              <p className="mt-3">
                <a
                  href={`mailto:${site.email}`}
                  className="text-primary hover:text-secondary transition-colors duration-200 cursor-pointer font-medium"
                >
                  {site.email}
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-3">8. Perubahan Kebijakan</h2>
              <p className="text-text-muted">
                Kami berhak memperbarui kebijakan ini. Versi terbaru selalu tersedia di halaman ini. Penggunaan website setelah perubahan diterbitkan berarti Anda menyetujui versi yang diperbarui.
              </p>
            </div>

            <div className="p-5 bg-muted rounded-xl border border-border text-sm text-text-muted">
              <strong className="font-semibold text-text block mb-1">Kontak Privasi</strong>
              Untuk pertanyaan terkait kebijakan privasi ini, hubungi:{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-primary hover:text-secondary transition-colors duration-200 cursor-pointer"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
      ) : null}
    </>
  );
}
