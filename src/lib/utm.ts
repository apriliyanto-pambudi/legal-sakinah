/**
 * UTM & session helper (client-only).
 *
 * PRD Section 6.3: nilai UTM dipertahankan selama sesi lewat sessionStorage
 * dan TIDAK dinormalisasi. Di sini hanya ada trim + pemotongan panjang.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const SESSION_ID_KEY = "ls_session_id";
const MAX_UTM_LENGTH = 255;

/** sessionStorage bisa melempar (mode privat Safari, cookie diblokir). */
function safeStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Simpan UTM dari URL saat ini ke sessionStorage.
 *
 * Jika URL membawa minimal satu parameter UTM, seluruh set lama dibuang lebih
 * dulu supaya sisa kampanye sebelumnya (mis. utm_content lama) tidak ikut
 * terkirim bersama kampanye baru.
 */
export function persistUtmFromUrl(search?: string): void {
  if (typeof window === "undefined") return;
  const storage = safeStorage();
  if (!storage) return;

  const params = new URLSearchParams(search ?? window.location.search);
  const incoming = UTM_KEYS.filter((key) => params.has(key));
  if (incoming.length === 0) return;

  UTM_KEYS.forEach((key) => storage.removeItem(key));
  incoming.forEach((key) => {
    const value = params.get(key)?.trim();
    if (value) storage.setItem(key, value.slice(0, MAX_UTM_LENGTH));
  });
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  const storage = safeStorage();
  if (!storage) return {};

  const result: UtmParams = {};
  UTM_KEYS.forEach((key) => {
    const value = storage.getItem(key);
    if (value) result[key] = value;
  });
  return result;
}

/**
 * ID sesi acak untuk deduplikasi klik di dashboard.
 * Bukan identitas pengunjung: hilang saat tab ditutup dan tidak pernah
 * dihubungkan dengan data pribadi.
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  const storage = safeStorage();
  if (!storage) return null;

  const existing = storage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  storage.setItem(SESSION_ID_KEY, generated);
  return generated;
}
