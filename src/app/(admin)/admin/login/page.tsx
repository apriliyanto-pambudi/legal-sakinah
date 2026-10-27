import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl bg-surface p-8 shadow-lg">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Legal Sakinah
        </h1>
        <p className="mb-6 mt-1 text-sm text-text-muted">
          Masuk ke panel admin
        </p>

        <Suspense
          fallback={<p className="text-sm text-text-muted">Memuat…</p>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
