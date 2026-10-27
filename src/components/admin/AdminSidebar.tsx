"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, isAdminNavActive } from "./nav-items";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col bg-primary p-4 text-white md:flex">
      <p className="mb-8 font-heading text-lg font-semibold">Legal Sakinah</p>

      <nav aria-label="Navigasi admin" className="flex flex-col gap-1">
        {ADMIN_NAV.map((item) => {
          const active = isAdminNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors duration-200 cursor-pointer ${
                active ? "bg-white/15 font-medium" : "hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
