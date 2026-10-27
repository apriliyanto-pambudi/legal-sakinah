"use client";

import { useEffect } from "react";
import { getSessionId, persistUtmFromUrl } from "@/lib/utm";

/**
 * Menyimpan UTM dari URL pendaratan ke sessionStorage dan menyiapkan session id.
 *
 * Sengaja hanya berjalan sekali saat mount: komponen ini dipasang di layout,
 * jadi ia berjalan pada setiap kunjungan penuh — persis saat traffic iklan tiba
 * membawa UTM. Navigasi internal setelahnya tidak boleh menimpa atribusi yang
 * sudah tersimpan.
 */
export default function UtmTracker() {
  useEffect(() => {
    persistUtmFromUrl();
    getSessionId();
  }, []);

  return null;
}
