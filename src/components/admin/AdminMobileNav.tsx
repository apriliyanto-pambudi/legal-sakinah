"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, isAdminNavActive } from "./nav-items";

export default function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi admin"
      className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2 md:hidden"
    >
      {ADMIN_NAV.map((item) => {
        const active = isAdminNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors duration-200 cursor-pointer ${
              active
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-muted hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
