/** Scroll ke #id, menghentikan tepat di bawah sticky header (tanpa sisa section sebelumnya). */
export function scrollToSectionId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector<HTMLElement>("header");
  // header + napas biar judul tidak mepet navbar
  const offset = (header?.offsetHeight ?? 68) + 28;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
