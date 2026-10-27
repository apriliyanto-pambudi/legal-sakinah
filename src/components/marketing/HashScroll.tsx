"use client";

import { useEffect } from "react";
import { scrollToSectionId } from "@/lib/scroll-to-section";

/** Scroll ke hash saat masuk beranda dari halaman lain (/faq → /#layanan). */
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => {
      scrollToSectionId(hash.slice(1));
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
