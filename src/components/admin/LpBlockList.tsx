"use client";

import { useRef, useState, useTransition } from "react";
import { GripVertical } from "lucide-react";
import LpBlockFields from "@/components/admin/LpBlockFields";
import DeleteButton from "@/components/admin/DeleteButton";
import { adminBtnPrimaryClass, adminInputClass } from "@/components/admin/form-styles";
import { reorderBlocks } from "@/server/actions/landing-pages";

/** Label awam per blockType — internal blockType tidak berubah. */
export const BLOCK_LABELS: Record<string, string> = {
  hero: "Strip CTA hero",
  image_cards: "Deretan foto",
  cta: "Tombol WhatsApp",
  problem: "Masalah",
  solution: "Solusi",
  process: "Proses",
  proof: "Bukti",
  faq: "FAQ",
  custom_html: "HTML kustom",
};

function blockPreview(blockType: string, content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const c = content as Record<string, unknown>;
  if (blockType === "hero") {
    return "foto + CTA";
  }
  if (blockType === "image_cards") {
    const cards = Array.isArray(c.cards) ? c.cards : [];
    const n = cards.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as { imageUrl?: unknown }).imageUrl === "string" &&
        (item as { imageUrl: string }).imageUrl
    ).length;
    return n > 0 ? `${n} foto` : "";
  }
  if (typeof c.title === "string" && c.title) return c.title;
  if (typeof c.eyebrow === "string" && c.eyebrow) return c.eyebrow;
  return "";
}

export interface BlockItem {
  id: string;
  blockType: string;
  content: unknown;
  sortOrder: number;
  isVisible: boolean;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
}

interface Props {
  landingPageId: string;
  blocks: BlockItem[];
}

export default function LpBlockList({ landingPageId, blocks: initial }: Props) {
  const [blocks, setBlocks] = useState(() =>
    [...initial].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const dragIdx = useRef<number | null>(null);

  function applyReorder(newBlocks: BlockItem[]) {
    const withOrder = newBlocks.map((b, i) => ({ ...b, sortOrder: i }));
    setBlocks(withOrder);
    startTransition(async () => {
      await reorderBlocks(
        landingPageId,
        withOrder.map((b) => ({ id: b.id, sortOrder: b.sortOrder }))
      );
    });
  }

  function handleDragStart(idx: number, e: React.DragEvent) {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(idx: number, e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    // Hanya clear jika benar-benar keluar dari item (bukan masuk child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIdx(null);
    }
  }

  function handleDrop(toIdx: number, e: React.DragEvent) {
    e.preventDefault();
    const fromIdx = dragIdx.current;
    setDragOverIdx(null);
    dragIdx.current = null;
    if (fromIdx === null || fromIdx === toIdx) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIdx, 1);
    newBlocks.splice(toIdx, 0, moved);
    applyReorder(newBlocks);
  }

  function handleDragEnd() {
    dragIdx.current = null;
    setDragOverIdx(null);
  }

  function moveBlock(idx: number, direction: -1 | 1) {
    const toIdx = idx + direction;
    if (toIdx < 0 || toIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(idx, 1);
    newBlocks.splice(toIdx, 0, moved);
    applyReorder(newBlocks);
  }

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Belum ada blok. Tambah strip hero, deretan foto, dan tombol WA dulu.
      </p>
    );
  }

  return (
    <div
      className={`space-y-3 transition-opacity duration-150 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      aria-label="Daftar blok"
    >
      {blocks.map((block, idx) => (
        <div
          key={block.id}
          draggable
          onDragStart={(e) => handleDragStart(idx, e)}
          onDragOver={(e) => handleDragOver(idx, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(idx, e)}
          onDragEnd={handleDragEnd}
          className={`rounded-lg border bg-surface transition-all duration-150 ${
            dragOverIdx === idx
              ? "border-accent ring-2 ring-accent/25 scale-[1.01]"
              : "border-border"
          }`}
        >
          {/* ── Handle drag (klik & seret, atau ↑↓ keyboard) ── */}
          <div
            className="flex items-center gap-2 border-b border-border px-4 py-2.5 cursor-grab active:cursor-grabbing select-none rounded-t-lg bg-muted/40"
            aria-label={`Blok: ${BLOCK_LABELS[block.blockType] ?? block.blockType}`}
          >
            <GripVertical className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />

            <span className="text-sm font-semibold text-primary">
              {BLOCK_LABELS[block.blockType] ?? block.blockType}
            </span>

            {blockPreview(block.blockType, block.content) ? (
              <span className="hidden sm:block text-xs text-text-muted truncate max-w-[180px] flex-1">
                — {blockPreview(block.blockType, block.content)}
              </span>
            ) : (
              <span className="flex-1" />
            )}

            {/* Tombol keyboard untuk aksesibilitas */}
            <div className="flex gap-1 ml-auto">
              <button
                type="button"
                onClick={() => moveBlock(idx, -1)}
                disabled={idx === 0}
                aria-label="Pindah ke atas"
                title="Pindah ke atas"
                className="p-1 rounded text-text-muted hover:text-primary hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xs leading-none"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(idx, 1)}
                disabled={idx === blocks.length - 1}
                aria-label="Pindah ke bawah"
                title="Pindah ke bawah"
                className="p-1 rounded text-text-muted hover:text-primary hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xs leading-none"
              >
                ↓
              </button>
            </div>
          </div>

          {/* ── Form edit isi blok ── */}
          <form action={block.updateAction} className="p-5 space-y-4">
            {/* sortOrder disimpan sebagai hidden — nilainya dari state */}
            <input type="hidden" name="sortOrder" value={block.sortOrder} />

            <div className="flex justify-end">
              <select
                name="isVisible"
                defaultValue={block.isVisible ? "true" : "false"}
                className={`${adminInputClass} w-auto bg-white`}
                aria-label="Visibilitas blok"
              >
                <option value="true">Tampil</option>
                <option value="false">Sembunyi</option>
              </select>
            </div>

            <LpBlockFields blockType={block.blockType} content={block.content} />

            <div className="flex items-center justify-between border-t border-border pt-3">
              <DeleteButton
                action={block.deleteAction}
                confirmMessage="Hapus blok ini?"
              />
              <button type="submit" className={adminBtnPrimaryClass}>
                Simpan blok
              </button>
            </div>
          </form>
        </div>
      ))}

      {isPending ? (
        <p className="text-xs text-text-muted text-center animate-pulse">
          Menyimpan urutan…
        </p>
      ) : null}
    </div>
  );
}
