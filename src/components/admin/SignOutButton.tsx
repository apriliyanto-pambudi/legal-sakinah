"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-text-muted transition-colors duration-200 hover:bg-muted hover:text-text disabled:opacity-60 cursor-pointer"
    >
      {isPending ? "Keluar…" : "Keluar"}
    </button>
  );
}
