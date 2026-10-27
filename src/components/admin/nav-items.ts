export const ADMIN_NAV = [
  { label: "Ringkasan", href: "/admin" },
  { label: "Layanan", href: "/admin/layanan" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Tim", href: "/admin/tim" },
  { label: "Halaman", href: "/admin/halaman" },
  { label: "Landing Pages", href: "/admin/landing-pages" },
  { label: "Pengaturan", href: "/admin/pengaturan" },
] as const;

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
