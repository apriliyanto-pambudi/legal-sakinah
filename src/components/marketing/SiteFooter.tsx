import Link from "next/link";
import { MapPin, Clock, Mail } from "lucide-react";
import WhatsappCta from "@/components/shared/WhatsappCta";
import type { PublicSiteConfig } from "@/lib/content/cms";
import { siteConfig } from "@/lib/content/site";

const navLinks = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/tim", label: "Tim Advokat" },
  { href: "/artikel", label: "Artikel" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
];

const legalLinks = [{ href: "/kebijakan-privasi", label: "Kebijakan Privasi" }];

export default function SiteFooter({ site }: { site: PublicSiteConfig }) {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-heading text-2xl font-semibold mb-1 text-white">
              {site.name}
            </p>
            <p className="ls-motto text-accent text-sm mb-4">{siteConfig.motto}</p>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              {site.tagline}. Pendampingan hukum keluarga yang tenang, jujur, dan dapat dipercaya.
            </p>
            <WhatsappCta ctaLabel="site_footer_wa" className="text-sm px-4 py-2.5">
              Hubungi Kami
            </WhatsappCta>
          </div>

          <nav aria-label="Tautan footer navigasi">
            <p className="text-xs font-semibold mb-4 text-white/55 uppercase tracking-[0.14em]">
              Navigasi
            </p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tautan footer legal">
            <p className="text-xs font-semibold mb-4 text-white/55 uppercase tracking-[0.14em]">
              Hukum & Privasi
            </p>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold mb-4 text-white/55 uppercase tracking-[0.14em]">
              Informasi Kontak
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Clock className="w-4 h-4 shrink-0 opacity-70" aria-hidden="true" />
                <span>{site.officeHours}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="w-4 h-4 shrink-0 opacity-70" aria-hidden="true" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/45">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Seluruh hak cipta dilindungi.
          </p>
          <p className="max-w-md sm:text-right leading-relaxed">
            Informasi di website ini bersifat umum dan tidak merupakan nasihat hukum.
            Konsultasikan situasi Anda langsung dengan advokat.
          </p>
        </div>
      </div>
    </footer>
  );
}
