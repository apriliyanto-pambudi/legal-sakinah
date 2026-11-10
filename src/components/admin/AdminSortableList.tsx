"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";

export interface SortableColumnHeader {
  label: string;
  className?: string;
}

export interface SortableListItem {
  id: string;
  sortOrder: number;
  status: string;
  label: string;
  editHref: string;
  deleteConfirm: string;
  cells: ReactNode[];
  publishAction: () => Promise<void>;
  unpublishAction: () => Promise<void>;
  deleteAction: () => Promise<void>;
}

interface Props {
  items: SortableListItem[];
  columnHeaders: SortableColumnHeader[];
  reorderAction: (items: { id: string; sortOrder: number }[]) => Promise<void>;
}

function sorted(list: SortableListItem[]) {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

export default function AdminSortableList({
  items: initial,
  columnHeaders,
  reorderAction,
}: Props) {
  const [items, setItems] = useState(() => sorted(initial));
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const dragIdx = useRef<number | null>(null);
  const signature = initial
    .map((item) => `${item.id}:${item.sortOrder}:${item.status}:${item.label}`)
    .join("|");

  useEffect(() => {
    setItems(sorted(initial));
    // Sinkron ulang hanya saat data server berubah (publish/hapus/refresh).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- signature menangkap isi
  }, [signature]);

  function applyReorder(next: SortableListItem[]) {
    const withOrder = next.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setItems(withOrder);
    startTransition(async () => {
      await reorderAction(
        withOrder.map((item) => ({ id: item.id, sortOrder: item.sortOrder }))
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

  function handleDragLeave(e: React.DragEvent<HTMLTableRowElement>) {
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
    const next = [...items];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    applyReorder(next);
  }

  function handleDragEnd() {
    dragIdx.current = null;
    setDragOverIdx(null);
  }

  function moveItem(idx: number, direction: -1 | 1) {
    const toIdx = idx + direction;
    if (toIdx < 0 || toIdx >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(toIdx, 0, moved);
    applyReorder(next);
  }

  return (
    <div
      className={`rounded-lg border border-border bg-surface overflow-hidden transition-opacity duration-150 ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="w-10 px-2 py-3" aria-label="Urutan drag" />
            {columnHeaders.map((col) => (
              <th
                key={col.label}
                className={`text-left px-4 py-3 font-semibold text-text ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
            <th className="text-left px-4 py-3 font-semibold text-text hidden sm:table-cell">
              Urutan
            </th>
            <th className="text-left px-4 py-3 font-semibold text-text">Status</th>
            <th className="text-right px-4 py-3 font-semibold text-text">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, idx) => (
            <tr
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(idx, e)}
              onDragOver={(e) => handleDragOver(idx, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(idx, e)}
              onDragEnd={handleDragEnd}
              className={`transition-colors duration-100 cursor-grab active:cursor-grabbing ${
                dragOverIdx === idx
                  ? "bg-accent/10 ring-2 ring-inset ring-accent/30"
                  : "hover:bg-muted/50"
              }`}
            >
              <td className="px-2 py-3 align-middle">
                <div className="flex flex-col items-center gap-0.5 select-none">
                  <GripVertical
                    className="w-4 h-4 text-text-muted"
                    aria-hidden="true"
                  />
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Pindah ${item.label} ke atas`}
                      title="Pindah ke atas"
                      className="p-0.5 rounded text-text-muted hover:text-primary hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xs leading-none"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      aria-label={`Pindah ${item.label} ke bawah`}
                      title="Pindah ke bawah"
                      className="p-0.5 rounded text-text-muted hover:text-primary hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xs leading-none"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </td>
              {item.cells.map((cell, cellIdx) => (
                <td
                  key={`${item.id}-${columnHeaders[cellIdx]?.label ?? cellIdx}`}
                  className={`px-4 py-3 ${columnHeaders[cellIdx]?.className ?? ""}`}
                >
                  {cell}
                </td>
              ))}
              <td className="px-4 py-3 text-text-muted hidden sm:table-cell tabular-nums">
                {item.sortOrder}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <PublishButton
                    currentStatus={item.status}
                    action={
                      item.status === "published"
                        ? item.unpublishAction
                        : item.publishAction
                    }
                  />
                  <Link
                    href={item.editHref}
                    className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={item.deleteAction}
                    confirmMessage={item.deleteConfirm}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPending ? (
        <p className="text-xs text-text-muted text-center py-2 animate-pulse border-t border-border">
          Menyimpan urutan…
        </p>
      ) : null}
    </div>
  );
}
