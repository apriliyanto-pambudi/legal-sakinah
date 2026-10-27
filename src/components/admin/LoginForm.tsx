"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "forbidden"
      ? "Akun Anda tidak memiliki akses ke panel admin."
      : null
  );
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const { error: signInError } = await signIn.email({
      email,
      password,
    });

    if (signInError) {
      // Pesan generik — jangan bocorkan email mana yang terdaftar
      setError("Email atau password salah.");
      setIsPending(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2.5 text-base text-text transition-colors duration-200 focus:border-primary focus:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-text">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2.5 text-base text-text transition-colors duration-200 focus:border-primary focus:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isPending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
