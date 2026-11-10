export const ADMIN_NAV = [
  { label: "Ringkasan", href: "/admin" },
  { label: "Beranda", href: "/admin/beranda" },
  { label: "Halaman situs", href: "/admin/halaman" },
  { label: "Layanan", href: "/admin/layanan" },
  { label: "Tim", href: "/admin/tim" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Testimoni", href: "/admin/testimoni" },
  { label: "Artikel", href: "/admin/artikel" },
  { label: "Landing Pages", href: "/admin/landing-pages" },
  { label: "Pengaturan", href: "/admin/pengaturan" },
  { label: "Akun", href: "/admin/akun" },
] as const;

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
