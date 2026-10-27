interface LpProcessProps {
  eyebrow: string;
  title: string;
  steps: { title: string; description: string }[];
}

export default function LpProcess({ eyebrow, title, steps }: LpProcessProps) {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-cta text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-10">
          {title}
        </h2>

        <ol className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4">
              <span
                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-semibold text-text mb-1.5">
                  <span className="sr-only">{`Langkah ${index + 1}: `}</span>
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
