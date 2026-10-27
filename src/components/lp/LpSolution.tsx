import { CheckCircle } from "lucide-react";

interface LpSolutionProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; description: string }[];
}

export default function LpSolution({
  eyebrow,
  title,
  intro,
  items,
}: LpSolutionProps) {
  return (
    <section className="py-14 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-cta text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
            {eyebrow}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-4">
            {title}
          </h2>
          <p className="text-text-muted leading-relaxed">{intro}</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 text-cta shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold text-text mb-1.5">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
