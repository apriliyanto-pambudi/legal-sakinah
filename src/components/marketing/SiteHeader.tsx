"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WhatsappCta from "@/components/shared/WhatsappCta";
import BrandLogo from "@/components/shared/BrandLogo";
import HomeBrandLink from "@/components/marketing/HomeBrandLink";
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

export default function SiteHeader({
  name,
  motto,
}: {
  name: string;
  motto: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [hash, setHash] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuOpenRef = useRef(false);

  const menuVisible = menuOpen || menuClosing;

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    if (!menuOpenRef.current) return;
    setMenuClosing(true);
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuClosing(false);
    setMenuOpen(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpenRef.current) closeMenu();
    else openMenu();
  }, [closeMenu, openMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) {
      setMenuEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [menuOpen]);

  /* Fallback unmount jika transitionend tidak terpanggil (reduced-motion, dsb.) */
  useEffect(() => {
    if (!menuClosing) return;
    const t = window.setTimeout(() => setMenuClosing(false), 320);
    return () => window.clearTimeout(t);
  }, [menuClosing]);

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
        closeMenu();
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  function isActive(href: string, linkHash: string | null) {
    if (linkHash) return pathname === "/" && hash === linkHash;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function goToSection(linkHash: string) {
    setHash(linkHash);
    closeMenu();
    if (pathname !== "/") return; // biar Next navigasi ke /#…
    scrollToSectionId(linkHash.slice(1));
    window.history.pushState(null, "", linkHash);
  }

  function handleMenuTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (
      e.propertyName !== "opacity" &&
      e.propertyName !== "grid-template-rows"
    ) {
      return;
    }
    if (menuClosing) setMenuClosing(false);
  }

  const panelOpen = menuEntered && !menuClosing;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
        <HomeBrandLink className="group shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm">
          <span className="flex items-center gap-2.5 group-hover:opacity-90 transition-opacity duration-200">
            <BrandLogo variant="mark" priority height={36} />
            <span className="min-w-0">
              <span className="block font-heading text-lg sm:text-xl md:text-2xl font-semibold text-primary leading-none tracking-tight">
                {name}
              </span>
              <span className="ls-motto hidden sm:block text-[0.7rem] text-accent mt-1 leading-none">
                {motto}
              </span>
            </span>
          </span>
        </HomeBrandLink>

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
            onClick={toggleMenu}
            className="md:hidden p-2.5 rounded-md text-text-muted hover:text-primary hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              className={`ls-burger${menuOpen ? " is-open" : ""}`}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {menuVisible ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`ls-mobile-menu md:hidden bg-surface${
            panelOpen ? " is-open" : ""
          }`}
          onTransitionEnd={handleMenuTransitionEnd}
        >
          <div className="ls-mobile-menu-panel">
            <nav
              aria-label="Navigasi mobile"
              className="max-w-6xl mx-auto border-t border-border px-4 py-4 flex flex-col gap-1"
            >
              <p className="ls-motto ls-mobile-menu-item text-accent text-xs px-3 mb-2">
                {motto}
              </p>
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
                        closeMenu();
                      }
                    }}
                    className={`ls-mobile-menu-item px-3 py-3 rounded-md text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
                className="ls-mobile-menu-item mt-3 w-full justify-center text-sm px-4 py-3"
              >
                Konsultasi via WhatsApp
              </WhatsappCta>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
