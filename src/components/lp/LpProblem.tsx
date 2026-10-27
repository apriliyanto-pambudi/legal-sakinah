interface LpProblemProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
}

export default function LpProblem({
  eyebrow,
  title,
  intro,
  items,
}: LpProblemProps) {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-cta text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-4">
          {title}
        </h2>
        <p className="text-text-muted leading-relaxed mb-8">{intro}</p>

        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-surface border border-border rounded-xl px-5 py-4"
            >
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full bg-cta shrink-0"
                aria-hidden="true"
              />
              <span className="text-text leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
