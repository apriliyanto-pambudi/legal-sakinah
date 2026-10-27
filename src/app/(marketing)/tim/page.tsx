import type { Metadata } from "next";
import { User } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { getPublicTeam } from "@/lib/content/cms";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `Tim Advokat — ${siteConfig.name}`,
  description:
    "Kenali tim advokat berpengalaman Legal Sakinah yang siap mendampingi Anda dalam perkara hukum keluarga.",
  openGraph: {
    title: `Tim Advokat — ${siteConfig.name}`,
    description: "Tim advokat berpengalaman di bidang hukum keluarga.",
    url: `${siteConfig.url}/tim`,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

export default async function TimPage() {
  const team = await getPublicTeam();

  return (
    <>
      <PageHero
        title="Tim Advokat Kami"
        description="Advokat berpengalaman yang memahami kompleksitas hukum keluarga sekaligus sensitivitas yang menyertainya."
        crumbs={[
          { href: "/", label: "Beranda" },
          { label: "Tim Advokat" },
        ]}
      />

      {/* Profil tim */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <article
                key={member.slug}
                className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col"
              >
                {/* Foto placeholder */}
                <div className="bg-muted h-52 flex items-center justify-center">
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt={`Foto ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <User className="w-16 h-16 opacity-30" aria-hidden="true" />
                      <span className="text-xs opacity-60">Foto akan segera tersedia</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-heading text-xl font-semibold text-primary mb-0.5">
                    {member.name}
                  </h2>
                  <p className="text-sm text-cta font-medium mb-4">{member.roleTitle}</p>
                  <p className="text-sm text-text-muted leading-relaxed flex-1">{member.bio}</p>

                  {member.expertise.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                        Keahlian
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.expertise.map((e) => (
                          <span
                            key={e}
                            className="text-xs bg-primary/8 text-primary px-2.5 py-1 rounded-full"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ls-atmosphere py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="ls-motto text-accent text-base mb-3">{siteConfig.motto}</p>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white mb-3">
            Konsultasikan situasi Anda
          </h2>
          <p className="text-white/75 mb-6 max-w-lg mx-auto">
            Tim kami siap mendengarkan dan memberi gambaran umum mengenai pilihan hukum yang tersedia.
          </p>
          <WhatsappCta ctaLabel="tim_cta_wa">Hubungi via WhatsApp</WhatsappCta>
        </div>
      </section>
    </>
  );
}
