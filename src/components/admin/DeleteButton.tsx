"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}

export default function DeleteButton({
  action,
  label = "Hapus",
  confirmMessage = "Yakin ingin menghapus? Tindakan ini tidak bisa dibatalkan.",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(confirmMessage)) return;
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? "Menghapus..." : label}
    </button>
  );
}
