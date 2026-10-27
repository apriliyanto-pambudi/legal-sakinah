import {
  getVisibleBlocks,
  type LandingPageBlock,
  type LandingPageRecord,
} from "@/lib/content/landing-pages";
import LpClosingCta from "./LpClosingCta";
import LpFaq from "./LpFaq";
import LpHero from "./LpHero";
import LpProblem from "./LpProblem";
import LpProcess from "./LpProcess";
import LpProof from "./LpProof";
import LpSolution from "./LpSolution";

/**
 * Merender blok LP sesuai urutan yang diatur admin.
 * Blok `hero` mengambil headline/subheadline dari baris landing page.
 */
function renderBlock(
  block: LandingPageBlock,
  lp: LandingPageRecord
): React.ReactNode {
  switch (block.blockType) {
    case "hero":
      return (
        <LpHero
          headline={lp.headline}
          subheadline={lp.subheadline}
          ctaText={lp.primaryCtaText}
          badges={block.content.badges}
          supportingNote={block.content.supportingNote}
        />
      );
    case "problem":
      return <LpProblem {...block.content} />;
    case "solution":
      return <LpSolution {...block.content} />;
    case "process":
      return <LpProcess {...block.content} />;
    case "proof":
      return <LpProof {...block.content} />;
    case "faq":
      return <LpFaq {...block.content} />;
    case "cta":
      return <LpClosingCta {...block.content} />;
    case "custom_html":
      return (
        <section className="bg-background py-12 md:py-16">
          <div
            className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6"
            dangerouslySetInnerHTML={{ __html: block.content.html }}
          />
        </section>
      );
  }
}

export default function LpBlocks({ lp }: { lp: LandingPageRecord }) {
  return (
    <>
      {getVisibleBlocks(lp).map((block) => (
        <div key={`${block.blockType}-${block.sortOrder}`}>
          {renderBlock(block, lp)}
        </div>
      ))}
    </>
  );
}
