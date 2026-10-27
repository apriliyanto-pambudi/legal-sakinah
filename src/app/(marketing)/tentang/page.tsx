import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import CmsHtml from "@/components/shared/CmsHtml";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicPage, getPublicSiteConfig } from "@/lib/content/cms";
import { siteConfig } from "@/lib/content/site";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([
    getPublicPage("tentang"),
    getPublicSiteConfig(),
  ]);

  return {
    title: page?.seoTitle || page?.title || `Tentang Kami — ${site.name}`,
    description:
      page?.seoDescription ||
      "Mengenal Legal Sakinah: firma hukum keluarga yang hadir dengan pendekatan profesional, empatik, dan berfokus pada kepentingan terbaik klien.",
    openGraph: {
      title: page?.seoTitle || page?.title || `Tentang Kami — ${site.name}`,
      description:
        page?.seoDescription ||
        "Firma hukum keluarga yang hadir dengan pendekatan profesional dan empatik.",
      url: `${site.url}/tentang`,
      siteName: site.name,
      locale: "id_ID",
      type: "website",
    },
  };
}

const values = [
  {
    icon: CheckCircle,
    title: "Profesionalisme",
    desc: "Setiap perkara ditangani dengan standar etika profesi advokat yang ketat, didukung pemahaman mendalam terhadap hukum keluarga.",
  },
  {
    icon: CheckCircle,
    title: "Empati",
    desc: "Kami memahami bahwa di balik berkas perkara ada manusia yang sedang menghadapi masa paling berat. Kami mendengar, bukan hanya memproses.",
  },
  {
    icon: CheckCircle,
    title: "Kejujuran",
    desc: "Kami tidak menjanjikan hasil yang tidak bisa kami pastikan. Klien mendapat gambaran realistis sejak awal agar dapat membuat keputusan yang tepat.",
  },
  {
    icon: CheckCircle,
    title: "Kerahasiaan",
    desc: "Setiap informasi yang Anda bagikan terlindungi oleh prinsip kerahasiaan advokat-klien. Privasi Anda adalah prioritas mutlak.",
  },
];

export default async function TentangPage() {
  const page = await getPublicPage("tentang");
  const cmsHtml = page?.content?.trim();

  return (
    <>
      <PageHero
        title={page?.title || "Tentang Legal Sakinah"}
        description="Firma hukum keluarga yang berdiri dengan satu keyakinan: setiap orang berhak mendapatkan pendampingan hukum yang profesional sekaligus manusiawi."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Tentang Kami" },
        ]}
      />

      {cmsHtml ? <CmsHtml html={cmsHtml} /> : null}

      {/* Misi & cerita — fallback jika CMS belum diisi */}
      {!cmsHtml ? (
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="ls-motto text-accent text-sm mb-2">{siteConfig.motto}</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-5">
                Hadir untuk mendampingi, bukan hanya memproses
              </h2>
              <div className="prose prose-slate max-w-none text-text-muted leading-relaxed space-y-4">
                <p>
                  Legal Sakinah lahir dari kepedulian terhadap kebutuhan masyarakat yang memerlukan pendampingan hukum keluarga yang dapat dipercaya. Kami menyadari bahwa perkara hukum keluarga — baik itu perceraian, hak asuh anak, sengketa waris, maupun perlindungan dari kekerasan — selalu membawa beban emosional yang berat.
                </p>
                <p>
                  Tim kami terdiri dari advokat berpengalaman yang tidak hanya memahami aspek hukum secara mendalam, tetapi juga terlatih untuk mendampingi klien dengan empati dan rasa hormat. Kami percaya bahwa kepercayaan dibangun melalui kejujuran — termasuk jujur mengenai kompleksitas dan ketidakpastian hukum yang ada.
                </p>
                <p>
                  Kami tidak memberikan jaminan hasil. Yang kami janjikan adalah pendampingan profesional, informasi yang transparan, dan komitmen penuh dalam setiap perkara yang kami tangani.
                </p>
              </div>
            </div>

            <div className="ls-soft-panel rounded-xl p-8">
              <h3 className="font-heading text-xl font-semibold text-primary mb-6">Area praktik utama</h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Proses Perceraian (cerai talak & cerai gugat)",
                  "Hak Asuh Anak (hadhanah)",
                  "Nafkah & Harta Bersama",
                  "Isbat Nikah",
                  "Waris Keluarga",
                  "KDRT & Perlindungan Hukum",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-text-muted italic">
                  Daftar area praktik bersifat indikatif. Konsultasikan situasi spesifik Anda untuk mengetahui apakah kami dapat membantu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <section className="py-16 md:py-20 bg-muted/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="ls-motto text-accent text-sm mb-2">Nilai kami</p>
            <div className="ls-rule mb-4" aria-hidden="true" />
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">
              Prinsip yang kami pegang
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex items-start gap-4 border-t border-border pt-5">
                  <Icon className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-text mb-1">{v.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ls-atmosphere py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="ls-motto text-accent text-base mb-3">{siteConfig.motto}</p>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3 text-white">
            Mulai dengan sebuah percakapan
          </h2>
          <p className="text-white/75 mb-6 max-w-lg mx-auto">
            Kami siap mendengarkan situasi Anda. Tidak ada komitmen awal, tidak ada tekanan.
          </p>
          <WhatsappCta ctaLabel="tentang_cta_wa">Hubungi Tim Kami</WhatsappCta>
        </div>
      </section>
    </>
  );
}
