"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { adminLabelClass } from "@/components/admin/form-styles";
import { parsePhotoPosition, photoObjectPosition } from "@/lib/content/team";

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
  /** Tampilkan penggeser posisi crop (foto tim). Default: false */
  showFocus?: boolean;
  /** name attribute input posisi. Default: "photoFocus" */
  focusName?: string;
  /** Nilai posisi awal (0–100 atau top/center/bottom). Default: 50 */
  currentFocus?: string | number | null;
  /** Tampilkan tombol hapus foto. Default: true */
  allowRemove?: boolean;
}

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
  currentFocus = 50,
  allowRemove = true,
}: PhotoUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [position, setPosition] = useState(() => parsePhotoPosition(currentFocus));
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRemoved(false);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemove() {
    setRemoved(true);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function setPositionFromClientY(el: HTMLElement, clientY: number) {
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) return;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPosition(Math.min(100, Math.max(0, Math.round(y))));
  }

  const displayUrl = removed ? null : preview ?? currentUrl ?? null;
  const keepExisting = Boolean(currentUrl && !preview && !removed);

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>

      {displayUrl && (
        <div
          className={`mb-2 overflow-hidden rounded-lg border border-border bg-muted ${previewClassName} ${
            showFocus ? "cursor-ns-resize touch-none" : ""
          }`}
          onPointerDown={
            showFocus
              ? (e) => {
                  dragRef.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setPositionFromClientY(e.currentTarget, e.clientY);
                }
              : undefined
          }
          onPointerMove={
            showFocus
              ? (e) => {
                  if (!dragRef.current) return;
                  setPositionFromClientY(e.currentTarget, e.clientY);
                }
              : undefined
          }
          onPointerUp={showFocus ? () => { dragRef.current = false; } : undefined}
          onPointerCancel={showFocus ? () => { dragRef.current = false; } : undefined}
          title={showFocus ? "Geser ke atas/bawah untuk atur crop" : undefined}
        >
          <Image
            src={displayUrl}
            alt={alt}
            width={800}
            height={600}
            className="h-full w-full object-cover pointer-events-none"
            style={showFocus ? { objectPosition: photoObjectPosition(position) } : undefined}
            unoptimized={preview !== null}
            draggable={false}
          />
        </div>
      )}

      {/* URL lama dipertahankan; string kosong = hapus foto di server */}
      {keepExisting ? (
        <input type="hidden" name={hiddenName} value={currentUrl!} />
      ) : removed ? (
        <input type="hidden" name={hiddenName} value="" />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
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

        {allowRemove && displayUrl ? (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
          >
            Hapus foto
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-text-muted">{hint}</p>

      {showFocus && displayUrl ? (
        <div className="mt-3">
          <label htmlFor={focusName} className={adminLabelClass}>
            Posisi foto
          </label>
          <input
            id={focusName}
            name={focusName}
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="mt-1 w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-text-muted">
            <span>Atas</span>
            <span>Tengah</span>
            <span>Bawah</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Geser slider, atau tarik preview ke atas/bawah, sampai wajah tidak terpotong.
          </p>
        </div>
      ) : showFocus ? (
        <input type="hidden" name={focusName} value={position} />
      ) : null}
    </div>
  );
}
