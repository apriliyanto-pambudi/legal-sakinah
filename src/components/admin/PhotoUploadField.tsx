"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { adminInputClass, adminLabelClass } from "@/components/admin/form-styles";
import {
  parsePhotoFocus,
  photoFocusObjectClass,
  type PhotoFocus,
} from "@/lib/content/team";

interface PhotoUploadFieldProps {
  currentUrl?: string | null;
  /** Label yang ditampilkan. Default: "Foto" */
  label?: string;
  /** name attribute file input. Default: "photo" */
  fileInputName?: string;
  /** name attribute hidden input untuk URL existing. Default: "photoUrl" */
  hiddenName?: string;
  /** Teks petunjuk di bawah tombol. Default: "JPEG, PNG, atau WebP · Maks 5 MB" */
  hint?: string;
  /** Class wrapper preview. Default: kotak 112×112px (cocok untuk foto tim) */
  previewClassName?: string;
  /** Alt text untuk preview */
  alt?: string;
  /** Tampilkan pilihan fokus crop (foto tim). Default: false */
  showFocus?: boolean;
  /** name attribute select fokus. Default: "photoFocus" */
  focusName?: string;
  /** Nilai fokus awal. Default: "center" */
  currentFocus?: string | null;
}

const FOCUS_OPTIONS: { value: PhotoFocus; label: string }[] = [
  { value: "top", label: "Atas" },
  { value: "center", label: "Tengah" },
  { value: "bottom", label: "Bawah" },
];

export default function PhotoUploadField({
  currentUrl,
  label = "Foto",
  fileInputName = "photo",
  hiddenName = "photoUrl",
  hint = "JPEG, PNG, atau WebP · Maks 5 MB",
  previewClassName = "h-28 w-28",
  alt = "Preview",
  showFocus = false,
  focusName = "photoFocus",
  currentFocus = "center",
}: PhotoUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [focus, setFocus] = useState<PhotoFocus>(parsePhotoFocus(currentFocus));
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  const displayUrl = preview ?? currentUrl ?? null;

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>

      {/* Preview gambar aktif / yang baru dipilih */}
      {displayUrl && (
        <div className={`mb-2 overflow-hidden rounded-lg border border-border bg-muted ${previewClassName}`}>
          <Image
            src={displayUrl}
            alt={alt}
            width={800}
            height={600}
            className={`h-full w-full object-cover ${photoFocusObjectClass(focus)}`}
            unoptimized={preview !== null} // blob URL tidak perlu optimasi
          />
        </div>
      )}

      {/* Kirim URL existing kalau tidak ganti gambar */}
      {currentUrl && !preview && (
        <input type="hidden" name={hiddenName} value={currentUrl} />
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text hover:bg-muted transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13"
          />
        </svg>
        {displayUrl ? "Ganti gambar" : "Pilih gambar"}
        <input
          ref={inputRef}
          type="file"
          name={fileInputName}
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleChange}
        />
      </label>
      <p className="mt-1 text-xs text-text-muted">{hint}</p>

      {showFocus && (
        <div className="mt-3">
          <label htmlFor={focusName} className={adminLabelClass}>
            Fokus foto
          </label>
          <select
            id={focusName}
            name={focusName}
            value={focus}
            onChange={(e) => setFocus(parsePhotoFocus(e.target.value))}
            className={`${adminInputClass} bg-white`}
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-text-muted">
            Geser area yang terlihat saat foto di-crop di website.
          </p>
        </div>
      )}
    </div>
  );
}
