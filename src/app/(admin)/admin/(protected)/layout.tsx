import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/guard";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SignOutButton from "@/components/admin/SignOutButton";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-dvh bg-muted">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <p className="truncate text-sm text-text-muted">
            {session.user.email}
          </p>
          <SignOutButton />
        </header>

        <AdminMobileNav />

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
