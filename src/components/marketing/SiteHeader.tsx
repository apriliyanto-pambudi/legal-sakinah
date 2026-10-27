"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import WhatsappCta from "@/components/shared/WhatsappCta";
import { siteConfig } from "@/lib/content/site";
import { scrollToSectionId } from "@/lib/scroll-to-section";

/** Hash = scroll section beranda. Tanpa hash = halaman sendiri (Tentang). */
const navLinks = [
  { href: "/tentang", hash: null, label: "Tentang" },
  { href: "/#layanan", hash: "#layanan", label: "Layanan" },
  { href: "/#tim", hash: "#tim", label: "Tim" },
  { href: "/#artikel", hash: "#artikel", label: "Artikel" },
  { href: "/#faq", hash: "#faq", label: "FAQ" },
  { href: "/#kontak", hash: "#kontak", label: "Kontak" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash);
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function isActive(href: string, linkHash: string | null) {
    if (linkHash) return pathname === "/" && hash === linkHash;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function goToSection(linkHash: string) {
    setHash(linkHash);
    setMenuOpen(false);
    if (pathname !== "/") return; // biar Next navigasi ke /#…
    scrollToSectionId(linkHash.slice(1));
    window.history.pushState(null, "", linkHash);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
        >
          <span className="block font-heading text-lg sm:text-xl md:text-2xl font-semibold text-primary leading-none tracking-tight group-hover:opacity-90 transition-opacity duration-200">
            <span className="sm:hidden">{siteConfig.shortName}</span>
            <span className="hidden sm:inline">{siteConfig.name}</span>
          </span>
          <span className="ls-motto hidden sm:block text-[0.7rem] text-accent mt-1 leading-none">
            {siteConfig.motto}
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.hash);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={(e) => {
                  if (link.hash && pathname === "/") {
                    e.preventDefault();
                    goToSection(link.hash);
                  } else if (link.hash) {
                    setHash(link.hash);
                  }
                }}
                className={`relative text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm ${
                  active
                    ? "text-primary font-semibold"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <WhatsappCta ctaLabel="header_wa" className="shrink-0 text-sm px-4 py-2.5 rounded-md shadow-sm">
              Konsultasi
            </WhatsappCta>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-md text-text-muted hover:text-primary hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {menuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-border bg-surface"
        >
          <nav
            aria-label="Navigasi mobile"
            className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1"
          >
            <p className="ls-motto text-accent text-xs px-3 mb-2">{siteConfig.motto}</p>
            {navLinks.map((link) => {
              const active = isActive(link.href, link.hash);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => {
                    if (link.hash && pathname === "/") {
                      e.preventDefault();
                      goToSection(link.hash);
                    } else {
                      if (link.hash) setHash(link.hash);
                      setMenuOpen(false);
                    }
                  }}
                  className={`px-3 py-3 rounded-md text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "bg-muted text-primary font-semibold"
                      : "text-text hover:bg-muted hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <WhatsappCta
              ctaLabel="header_menu_wa"
              className="mt-3 w-full justify-center text-sm px-4 py-3"
            >
              Konsultasi via WhatsApp
            </WhatsappCta>
          </nav>
        </div>
      )}
    </header>
  );
}
