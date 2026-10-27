import Link from "next/link";
import { LP_DISCLAIMER } from "@/lib/content/landing-pages";

/**
 * Footer minimal LP: hanya disclaimer, hak cipta, dan satu tautan Kebijakan
 * Privasi. Tidak ada navigasi lain (PRD Section 6.1).
 */
export default function LpFooter() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-3">
        <p className="text-xs text-text-muted leading-relaxed">
          {LP_DISCLAIMER}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          <span>
            &copy; {new Date().getFullYear()} Legal Sakinah. Seluruh hak cipta
            dilindungi.
          </span>
          <Link
            href="/kebijakan-privasi"
            className="underline underline-offset-2 hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
          >
            Kebijakan Privasi
          </Link>
        </div>
      </div>
    </footer>
  );
}
