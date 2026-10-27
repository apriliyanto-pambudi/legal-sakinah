import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  Heart,
  Landmark,
  FileText,
  Users,
  Shield,
  CheckCircle,
  ChevronRight,
  Phone,
  Handshake,
  ShieldCheck,
  HeartHandshake,
  User,
} from "lucide-react";
import WhatsappCta from "@/components/shared/WhatsappCta";
import HashScroll from "@/components/marketing/HashScroll";
import Reveal from "@/components/marketing/Reveal";
import PortraitDummy from "@/components/marketing/PortraitDummy";
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import {
  getPublicFaqs,
  getPublicServices,
  getPublicTeam,
} from "@/lib/content/cms";
import {
  formatArticleDate,
  getPublishedArticles,
} from "@/lib/content/articles";
import { getTestimonials } from "@/lib/content/testimonials";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.motto}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.motto}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Heart,
  Landmark,
  FileText,
  Users,
  Shield,
};

/** Urutan highlight mengikuti pola referensi: 3 besar + sisanya */
const FEATURED_SLUGS = ["perceraian", "hak-asuh-anak", "nafkah-harta-bersama"];

const values = [
  {
    icon: ShieldCheck,
    title: "Terpercaya",
    desc: "Kejujuran adalah pondasi. Kami menjelaskan apa yang realistis — tanpa janji hasil yang tidak bisa dipastikan.",
  },
  {
    icon: Handshake,
    title: "Profesional",
    desc: "Standar etika advokat dijaga ketat, dari konsultasi awal hingga pendampingan di persidangan.",
  },
  {
    icon: HeartHandshake,
    title: "Empatik",
    desc: "Perkara keluarga sensitif. Kami mendampingi dengan tenang, rahasia, dan penuh hormat.",
  },
];

export default async function BerandaPage() {
  const [services, faqs, team] = await Promise.all([
    getPublicServices(),
    getPublicFaqs(),
    getPublicTeam(),
  ]);
  const testimonials = getTestimonials().slice(0, 7);
  const faqPreview = faqs.slice(0, 4);
  const articlePreview = getPublishedArticles().slice(0, 3);

  const featured = FEATURED_SLUGS.map((slug) =>
    services.find((s) => s.slug === slug)
  ).filter(Boolean) as typeof services;
  const featuredIds = new Set(featured.map((s) => s.slug));
  const otherServices = services.filter((s) => !featuredIds.has(s.slug));
  const teamPreview = team.slice(0, 3);

  return (
    <>
      <HashScroll />
      {/* ── 1. Hero: brand kiri + portrait soft-blend (tanpa frame/chip) */}
      <section className="ls-atmosphere overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
            {/* Copy — brand first, kiri */}
            <div>
              <p className="ls-rise font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight">
                {siteConfig.name}
              </p>
              <p className="ls-rise ls-rise-delay-1 ls-motto text-accent text-xl mt-2 mb-5">
                {siteConfig.motto}
              </p>
              <div className="ls-rise ls-rise-delay-1 ls-rule mb-6" aria-hidden="true" />
              <h1 className="ls-rise ls-rise-delay-2 font-heading text-2xl sm:text-3xl md:text-[2.15rem] font-semibold text-white leading-snug mb-5">
                Pendampingan hukum keluarga yang tenang, jujur, dan dapat dipercaya.
              </h1>
              <p className="ls-rise ls-rise-delay-2 text-white/75 text-base leading-relaxed mb-4 max-w-lg">
                Spesialis perkara perceraian, hak asuh anak, harta bersama, isbat nikah, waris,
                dan perlindungan hukum keluarga — didampingi dengan kepekaan terhadap situasi
                yang sensitif.
              </p>
              <p className="ls-rise ls-rise-delay-2 text-white/55 text-sm mb-8 max-w-lg">
                Langkah pertama adalah percakapan. Tanpa tekanan, tanpa komitmen.
              </p>
              <div className="ls-rise ls-rise-delay-3 flex flex-col sm:flex-row gap-3">
                <WhatsappCta ctaLabel="hero_wa" className="text-base px-6 py-3.5 shadow-md">
                  Konsultasi via WhatsApp
                </WhatsappCta>
                <Link
                  href="/layanan"
                  className="inline-flex items-center justify-center gap-2 min-h-11 border border-white/25 text-white text-base font-semibold px-6 py-3.5 rounded-md hover:bg-white/10 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Lihat layanan
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Portrait dummy — ganti PortraitDummy dengan foto asli nanti */}
            <div className="ls-rise ls-rise-delay-2 relative mx-auto w-full max-w-[20rem] sm:max-w-sm lg:max-w-none lg:justify-self-end">
              <div className="ls-portrait-presence relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-sm">
                <PortraitDummy fill label="Foto advokat (dummy)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Area praktik utama (3 highlight) ──────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div id="layanan" className="ls-anchor max-w-2xl mb-10">
              <p className="ls-motto text-accent text-sm mb-2">Area praktik utama</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">
                Perkara yang paling sering kami dampingi
              </h2>
            </div>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featured.length > 0 ? featured : services.slice(0, 3)).map((service) => {
              const Icon = iconMap[service.icon] ?? Scale;
              return (
                <Link
                  key={service.slug}
                  href={`/layanan/${service.slug}`}
                  className="group ls-soft-panel rounded-xl p-6 md:p-7 flex flex-col hover:border-accent/40 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm font-semibold text-accent mb-3">
                    {siteConfig.startingPriceLabel}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed flex-1 mb-5">
                    {service.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all duration-200">
                    Pelajari lebih lanjut
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </Reveal>
          <p className="mt-6 text-xs text-text-muted max-w-2xl leading-relaxed">
            Biaya bersifat indikatif &ldquo;mulai dari&rdquo;. Nilai akhir menyesuaikan kompleksitas
            perkara, lingkup pendampingan, dan kesepakatan setelah konsultasi.
          </p>
        </div>
      </section>

      {/* ── 3. Layanan lainnya ───────────────────────────────────────── */}
      {otherServices.length > 0 && (
        <section className="pb-16 md:pb-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherServices.map((service) => {
                const Icon = iconMap[service.icon] ?? Scale;
                return (
                  <Link
                    key={service.slug}
                    href={`/layanan/${service.slug}`}
                    className="group border-t border-border pt-5 hover:border-accent/50 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                  >
                    <Icon className="w-5 h-5 text-accent mb-3" aria-hidden="true" />
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-accent mb-2">
                      {siteConfig.startingPriceLabel}
                    </p>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      {service.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Detail
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </Reveal>
            <Reveal className="mt-10">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
              >
                Semua layanan hukum keluarga
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── 4. Mid CTA: close-up (bukan ulang full portrait hero) ─────── */}
      <section className="py-16 md:py-20 bg-muted/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal stagger className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="ls-motto text-accent text-sm mb-2">{siteConfig.motto}</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-4">
                Konsultasi via WhatsApp atau atur pertemuan
              </h2>
              <p className="text-text-muted leading-relaxed mb-7 max-w-lg">
                Ceritakan situasi Anda di tempat yang nyaman. Kami bantu memetakan pilihan hukum
                yang tersedia — tanpa tekanan untuk langsung mengambil keputusan.
              </p>
              <WhatsappCta ctaLabel="midband_wa" className="text-base px-6 py-3.5">
                Mulai konsultasi
              </WhatsappCta>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg ring-1 ring-border/60">
                <PortraitDummy fill label="Foto konsultasi (dummy)" />
              </div>
              <p className="mt-3 text-center text-xs text-text-muted">
                Percakapan awal via WhatsApp — tanpa komitmen
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. Nilai ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="max-w-2xl mb-10">
              <p className="ls-motto text-accent text-sm mb-2">Nilai yang kami pegang</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-3">
                Pondasi setiap pendampingan
              </h2>
              <p className="text-text-muted leading-relaxed">
                Kami berkomitmen memberikan pelayanan terbaik dengan berpegang pada kebenaran —
                bukan janji kosong.
              </p>
            </div>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="ls-soft-panel rounded-xl p-6 border-t-2 border-t-accent/70"
                >
                  <Icon className="w-6 h-6 text-accent mb-4" aria-hidden="true" />
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── 6. Mengapa + carousel testimoni (2 terlihat) ─────────────── */}
      <section className="py-16 md:py-20 bg-muted/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal stagger className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="ls-motto text-accent text-sm mb-2">Mengapa {siteConfig.shortName}</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-5">
                Hadir saat Anda paling membutuhkan kepastian
              </h2>
              <p className="text-text-muted leading-relaxed mb-6">
                Di balik setiap berkas perkara ada manusia yang sedang menghadapi momen berat.
                Kami mendampingi dengan standar profesional sekaligus kepekaan manusiawi.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "Berpengalaman di Pengadilan Agama & Negeri",
                  "Pendekatan empatik & kerahasiaan klien",
                  "Transparan sejak konsultasi awal",
                  "Bimbingan langkah demi langkah",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <WhatsappCta ctaLabel="why_us_wa" className="text-sm px-5 py-2.5">
                Mulai percakapan
              </WhatsappCta>
            </div>

            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* ── 7. Tim teaser ────────────────────────────────────────────── */}
      {teamPreview.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div
                id="tim"
                className="ls-anchor flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
              >
                <div>
                  <p className="ls-motto text-accent text-sm mb-2">Tim kami</p>
                  <div className="ls-rule mb-4" aria-hidden="true" />
                  <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">
                    Advokat yang siap mendampingi
                  </h2>
                </div>
                <Link
                  href="/tim"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  Lihat seluruh tim
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {teamPreview.map((member) => (
                <article
                  key={member.slug}
                  className="ls-soft-panel rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="relative bg-muted h-56 flex items-center justify-center">
                    {member.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photoUrl}
                        alt={`Foto ${member.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-muted">
                        <User className="w-12 h-12 opacity-30" aria-hidden="true" />
                        <span className="text-xs opacity-60">Foto dummy</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-primary">
                      {member.name}
                    </h3>
                    <p className="text-sm text-accent font-medium mt-0.5">{member.roleTitle}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── 8. Artikel ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div
              id="artikel"
              className="ls-anchor flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
            >
              <div>
                <p className="ls-motto text-accent text-sm mb-2">Artikel & edukasi</p>
                <div className="ls-rule mb-4" aria-hidden="true" />
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">
                  Baca untuk lebih memahami prosesnya
                </h2>
              </div>
              <Link
                href="/artikel"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
              >
                Semua artikel
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlePreview.map((article) => (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className="group ls-soft-panel rounded-xl p-6 flex flex-col hover:border-accent/40 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                  {article.category}
                </p>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors duration-200 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">
                  {article.excerpt}
                </p>
                <time
                  dateTime={article.publishedAt}
                  className="text-xs text-text-muted"
                >
                  {formatArticleDate(article.publishedAt)}
                </time>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-muted/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div id="faq" className="ls-anchor mb-10">
              <p className="ls-motto text-accent text-sm mb-2">Pertanyaan umum</p>
              <div className="ls-rule mb-4" aria-hidden="true" />
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">
                Yang sering ditanyakan
              </h2>
            </div>
          </Reveal>

          <Reveal stagger className="flex flex-col divide-y divide-border mb-8">
            {faqPreview.map((faq) => (
              <details key={faq.id} className="group py-1">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-semibold text-text hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm">
                  <span>{faq.question}</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 text-text-muted group-open:rotate-90 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pb-5 text-sm text-text-muted leading-relaxed pr-8">
                  {faq.answer}
                </div>
              </details>
            ))}
          </Reveal>

          <Reveal>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
            >
              Semua pertanyaan
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── 10. Closing CTA ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-background border-t border-border">
        <Reveal>
          <div id="kontak" className="ls-anchor max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="ls-motto text-accent text-lg mb-3">{siteConfig.motto}</p>
            <div className="ls-rule mx-auto mb-5" aria-hidden="true" />
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-primary">
              Siap memulai percakapan?
            </h2>
            <p className="text-text-muted max-w-xl mx-auto mb-9 leading-relaxed">
              Tanpa tekanan, tanpa komitmen. Ceritakan situasinya — kami bantu memahami pilihan yang
              tersedia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsappCta ctaLabel="cta_footer_wa" className="text-base px-6 py-3.5 shadow-md">
                Hubungi via WhatsApp
              </WhatsappCta>
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 min-h-11 border border-border text-primary text-base font-semibold px-6 py-3.5 rounded-md bg-surface hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Info kontak
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
