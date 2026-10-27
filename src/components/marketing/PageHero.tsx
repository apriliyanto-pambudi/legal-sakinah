import Link from "next/link";
import { siteConfig } from "@/lib/content/site";

interface Crumb {
  href?: string;
  label: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  compact?: boolean;
}

export default function PageHero({
  title,
  description,
  crumbs,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`ls-atmosphere ${compact ? "py-12 md:py-16" : "py-14 md:py-20"}`}
      aria-labelledby="page-hero-title"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/55">
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-white/30">
                      /
                    </span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/90">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <p className="ls-motto text-accent text-sm md:text-base mb-3">
          {siteConfig.motto}
        </p>
        <div className="ls-rule mb-5" aria-hidden="true" />
        <h1
          id="page-hero-title"
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight max-w-3xl"
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-white/75 text-base md:text-lg max-w-2xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
