import Image from "next/image";
import WhatsappCta from "@/components/shared/WhatsappCta";

export interface LpImageCardItem {
  imageUrl: string;
  title: string;
  caption: string;
  ctaText: string;
}

interface LpImageCardsProps {
  eyebrow: string;
  title: string;
  cards: LpImageCardItem[];
}

/**
 * Blok kartu foto untuk LP ads visual (pola Prestige: gambar + caption + CTA).
 */
export default function LpImageCards({ eyebrow, title, cards }: LpImageCardsProps) {
  if (cards.length === 0) return null;

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {eyebrow ? (
          <p className="text-sm font-medium text-accent tracking-wide mb-2">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary mb-8 md:mb-10">
            {title}
          </h2>
        ) : null}

        <ul className="flex flex-col gap-10 md:gap-12">
          {cards.map((card, index) => (
            <li key={`${card.title}-${index}`} className="flex flex-col gap-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.title || `Kartu ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-text-muted">
                    Belum ada gambar
                  </div>
                )}
              </div>

              {card.title ? (
                <h3 className="font-heading text-xl font-semibold text-primary">
                  {card.title}
                </h3>
              ) : null}

              {card.caption ? (
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {card.caption}
                </p>
              ) : null}

              <WhatsappCta
                ctaLabel={`image_card_${index}_wa`}
                className="w-full sm:w-auto text-base px-6 py-3.5 shadow-md justify-center"
              >
                {card.ctaText || "Konsultasi via WhatsApp"}
              </WhatsappCta>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
