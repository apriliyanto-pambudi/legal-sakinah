"use client";

import { useTransition } from "react";

interface PublishButtonProps {
  action: () => Promise<void>;
  currentStatus: string;
}

export default function PublishButton({ action, currentStatus }: PublishButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isPublished = currentStatus === "published";

  function handleClick() {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        isPublished
          ? "text-slate-600 border-slate-200 hover:bg-slate-50"
          : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
      }`}
    >
      {isPending
        ? "Memproses..."
        : isPublished
        ? "Cabut Tayang"
        : "Tayangkan"}
    </button>
  );
}
