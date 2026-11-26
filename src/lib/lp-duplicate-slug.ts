/**
 * Slug dasar untuk duplikasi LP iklan: buang -copy-* dan -NN (2 digit).
 * shortcut: -NN di akhir dianggap nomor kopi, bukan bagian nama slug.
 */
export function lpDuplicateBaseSlug(slug: string): string {
  let s = slug;
  while (/-copy-[a-z0-9]+$/i.test(s)) {
    s = s.replace(/-copy-[a-z0-9]+$/i, "");
  }
  while (/-\d{2}$/.test(s)) {
    s = s.replace(/-\d{2}$/, "");
  }
  return s || slug;
}

export function lpDuplicateBaseInternalName(
  name: string | null | undefined,
): string | null {
  if (!name?.trim()) return null;
  return name.replace(/(\s*\(kopi(?:\s+\d+)?\))+$/i, "").trim() || null;
}

export function nextLpDuplicateSlug(
  base: string,
  existingSlugs: readonly string[],
): { slug: string; n: number } {
  const used = new Set(existingSlugs);
  for (let n = 1; n <= 999; n++) {
    const slug = `${base}-${String(n).padStart(2, "0")}`;
    if (!used.has(slug)) return { slug, n };
  }
  const n = Date.now();
  return { slug: `${base}-${n.toString(36)}`, n };
}

export function formatLpDuplicateInternalName(
  baseName: string | null,
  n: number,
): string | null {
  if (!baseName) return null;
  return `${baseName} (kopi ${String(n).padStart(2, "0")})`;
}
