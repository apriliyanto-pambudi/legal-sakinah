/**
 * Pembentukan URL wa.me. Dipakai server maupun client.
 */

/** wa.me hanya menerima digit: buang "+", spasi, tanda kurung, dan strip. */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function buildWhatsappUrl(number: string, prefill: string): string {
  const digits = normalizeWhatsappNumber(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`;
}
