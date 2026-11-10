import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { getAllArticlesForAdmin } from "@/server/db/queries/articles";
import { getAllFaqsForAdmin } from "@/server/db/queries/faqs";
import { getAllLandingPagesForAdmin } from "@/server/db/queries/landing-pages";
import { getAllPagesForAdmin } from "@/server/db/queries/pages";
import { getAllServicesForAdmin } from "@/server/db/queries/services";
import { getAllTeamForAdmin } from "@/server/db/queries/team";
import { getAllTestimonialsForAdmin } from "@/server/db/queries/testimonials";

function countByStatus(rows: { status: string }[]) {
  return {
    total: rows.length,
    published: rows.filter((row) => row.status === "published").length,
    draft: rows.filter((row) => row.status !== "published").length,
  };
}

const cards = [
  { href: "/admin/layanan", label: "Layanan", key: "services" },
  { href: "/admin/artikel", label: "Artikel", key: "articles" },
  { href: "/admin/faq", label: "FAQ", key: "faqs" },
  { href: "/admin/testimoni", label: "Testimoni", key: "testimonials" },
  { href: "/admin/tim", label: "Tim", key: "team" },
  { href: "/admin/halaman", label: "Halaman", key: "pages" },
  { href: "/admin/landing-pages", label: "Landing Pages", key: "landingPages" },
] as const;

const staticLinks = [
  { href: "/admin/beranda", label: "Beranda", desc: "Headline, deskripsi, CTA, dan foto hero." },
  { href: "/admin/pengaturan", label: "Pengaturan", desc: "Nomor WhatsApp, prefill, dan info kontak." },
] as const;

export default async function AdminHomePage() {
  const session = await requireAdmin();

  const [services, articles, faqs, testimonials, team, pages, landingPages] =
    await Promise.all([
      getAllServicesForAdmin(),
      getAllArticlesForAdmin(),
      getAllFaqsForAdmin(),
      getAllTestimonialsForAdmin(),
      getAllTeamForAdmin(),
      getAllPagesForAdmin(),
      getAllLandingPagesForAdmin(),
    ]);

  const stats = {
    services: countByStatus(services),
    articles: countByStatus(articles),
    faqs: countByStatus(faqs),
    testimonials: countByStatus(testimonials),
    team: countByStatus(team),
    pages: countByStatus(pages),
    landingPages: countByStatus(landingPages),
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-primary">
        Ringkasan CMS
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Selamat datang, {session.user.name || session.user.email}. Ubah konten
        lalu tayangkan agar muncul di website publik tanpa deploy ulang.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const stat = stats[card.key];
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-primary/30 cursor-pointer"
            >
              <p className="font-heading text-lg font-semibold text-primary">
                {card.label}
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {stat.published} tayang · {stat.draft} draft · {stat.total} total
              </p>
            </Link>
          );
        })}
        {staticLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-primary/30 cursor-pointer"
          >
            <p className="font-heading text-lg font-semibold text-primary">
              {link.label}
            </p>
            <p className="mt-2 text-sm text-text-muted">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
