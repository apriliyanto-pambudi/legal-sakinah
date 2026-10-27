"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/content/testimonials";

type Props = {
  items: Testimonial[];
};

function Card({ t }: { t: Testimonial }) {
  return (
    <blockquote className="ls-soft-panel rounded-xl p-5 flex flex-col w-[min(100%,18.5rem)] sm:w-[17.5rem] shrink-0 h-[17rem] sm:h-[18rem]">
      <Quote className="w-5 h-5 text-accent/40 mb-3 shrink-0" aria-hidden="true" />
      <p className="text-sm text-text leading-relaxed flex-1 italic overflow-hidden">
        &ldquo;{t.quote}&rdquo;
      </p>
      <footer className="mt-4 text-xs text-text-muted font-medium shrink-0">
        — {t.attribution}
      </footer>
    </blockquote>
  );
}

/** Marquee horizontal — gulir kontinu, pause hover/fokus, reduced-motion = 2 kartu statis. */
export default function TestimonialCarousel({ items }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (items.length === 0) return null;

  if (reduceMotion || items.length < 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
        {items.slice(0, 2).map((t) => (
          <Card key={t.id} t={t} />
        ))}
      </div>
    );
  }

  // Duplikasi track biar loop tanpa loncat
  const track = [...items, ...items];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="ls-testimonial-marquee-viewport overflow-hidden">
        <div
          className={`ls-testimonial-marquee flex w-max gap-5 ${paused ? "is-paused" : ""}`}
          aria-label="Testimoni klien bergulir"
        >
          {track.map((t, i) => (
            <Card key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
      <p className="sr-only">
        Testimoni bergulir otomatis. Arahkan kursor atau fokus ke area ini untuk menjeda.
      </p>
    </div>
  );
}
