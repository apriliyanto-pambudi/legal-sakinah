import Image from "next/image";

export interface LpImageCardItem {
  imageUrl: string;
  /** Field lama — diabaikan di render (kompatibel data CMS lama). */
  title?: string;
  caption?: string;
  ctaText?: string;
}

interface LpImageCardsProps {
  cards: LpImageCardItem[];
  /** Diabaikan — sisa content lama dari CMS. */
  eyebrow?: string;
  title?: string;
}

/**
 * Deretan foto LP ads — ritme Prestige: gambar full-width bertumpuk, tanpa teks.
 * Desktop: kolom sempit centered (480px).
 */
export default function LpImageCards({ cards }: LpImageCardsProps) {
  const images = cards.filter((card) => Boolean(card.imageUrl));
  if (images.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="max-w-[480px] mx-auto">
        <ul className="flex flex-col">
          {images.map((card, index) => (
            <li key={`${card.imageUrl}-${index}`}>
              <Image
                src={card.imageUrl}
                alt={`Gambar ${index + 1}`}
                width={900}
                height={900}
                className="w-full h-auto block"
                sizes="(max-width: 480px) 100vw, 480px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
