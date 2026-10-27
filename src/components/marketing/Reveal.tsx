"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Animasi bertahap untuk anak langsung (kartu grid) */
  stagger?: boolean;
};

/** Reveal saat masuk viewport — sekali, tenang, hormati reduced-motion. */
export default function Reveal({ children, className = "", stagger = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      setArmed(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
    if (alreadyInView) {
      setVisible(true);
      setArmed(true);
      return;
    }

    setVisible(false);
    setArmed(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealClass = armed
    ? `ls-reveal${stagger ? " ls-reveal-stagger" : ""}${visible ? " is-visible" : ""}`
    : "";

  return (
    <div ref={ref} className={`${revealClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
