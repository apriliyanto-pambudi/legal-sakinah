"use client";

import { createContext, useContext, useMemo } from "react";

/**
 * Konteks halaman untuk seluruh CTA WhatsApp di bawahnya.
 *
 * Dipasang oleh landing page ads supaya setiap tombol otomatis membawa
 * `lp_slug` serta nomor/prefill khusus LP tanpa perlu diteruskan manual ke
 * tiap komponen. Halaman website utama tidak memasang provider ini, sehingga
 * event tercatat sebagai `page_type = 'site'`.
 */

export interface CtaScope {
  lpSlug: string | null;
  waNumber?: string;
  prefill?: string;
}

const CtaScopeContext = createContext<CtaScope | null>(null);

export function CtaScopeProvider({
  lpSlug,
  waNumber,
  prefill,
  children,
}: CtaScope & { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ lpSlug, waNumber, prefill }),
    [lpSlug, waNumber, prefill]
  );

  return (
    <CtaScopeContext.Provider value={value}>{children}</CtaScopeContext.Provider>
  );
}

export function useCtaScope(): CtaScope | null {
  return useContext(CtaScopeContext);
}
