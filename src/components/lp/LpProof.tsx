import { CheckCircle, Quote } from "lucide-react";

interface LpProofProps {
  eyebrow: string;
  title: string;
  points: string[];
  testimonials: { quote: string; attribution: string }[];
  note: string;
}

export default function LpProof({
  eyebrow,
  title,
  points,
  testimonials,
  note,
}: LpProofProps) {
  return (
    <section className="py-14 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-cta text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-8">
          {title}
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 text-cta shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-text leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.attribution}
              className="bg-surface border border-border rounded-xl p-5 flex flex-col"
            >
              <Quote className="w-6 h-6 text-cta/40 mb-3" aria-hidden="true" />
              <p className="text-text leading-relaxed italic flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-text-muted font-medium">
                — {testimonial.attribution}
              </footer>
            </blockquote>
          ))}
        </div>

        <p className="text-xs text-text-muted leading-relaxed mt-6">{note}</p>
      </div>
    </section>
  );
}
