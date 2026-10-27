import { ChevronRight } from "lucide-react";
import WhatsappCta from "@/components/shared/WhatsappCta";

interface LpFaqProps {
  eyebrow: string;
  title: string;
  items: { question: string; answer: string }[];
}

/**
 * Accordion memakai <details>/<summary> bawaan browser: status buka/tutup sudah
 * diumumkan ke screen reader dan tetap berfungsi tanpa JavaScript.
 */
export default function LpFaq({ eyebrow, title, items }: LpFaqProps) {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-cta text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-8">
          {title}
        </h2>

        <div className="flex flex-col gap-3 mb-8">
          {items.map((item) => (
            <details
              key={item.question}
              className="group bg-surface rounded-xl border border-border overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-text hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span>{item.question}</span>
                <ChevronRight
                  className="w-4 h-4 shrink-0 text-text-muted group-open:rotate-90 transition-transform duration-200"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-5 pt-4 border-t border-border text-sm text-text-muted leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="bg-muted border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-sm text-text-muted leading-relaxed flex-1">
            Pertanyaan Anda belum terjawab? Tanyakan langsung — kami akan
            menjelaskan sesuai kondisi perkara Anda.
          </p>
          <WhatsappCta ctaLabel="faq_wa" className="text-sm px-5 py-2.5 shrink-0">
            Tanya via WhatsApp
          </WhatsappCta>
        </div>
      </div>
    </section>
  );
}
