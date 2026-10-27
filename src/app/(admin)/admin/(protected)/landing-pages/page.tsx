import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  deleteLandingPage,
  duplicateLandingPage,
  publishLandingPage,
  unpublishLandingPage,
} from "@/server/actions/landing-pages";
import { requireAdmin } from "@/server/auth/guard";
import { getAllLandingPagesForAdmin } from "@/server/db/queries/landing-pages";

export default async function AdminLandingPagesPage() {
  await requireAdmin();
  const pages = await getAllLandingPagesForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            Landing Pages
          </h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Kelola LP iklan. Draft menampilkan 404 di publik.
          </p>
        </div>
        <Link
          href="/admin/landing-pages/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah LP
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-sm text-text-muted">Belum ada landing page.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-text">Nama internal</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-text md:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-text">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.id} className="transition-colors duration-100 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-text">
                    {page.internalName || page.headline}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-text-muted md:table-cell">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={page.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <PublishButton
                        currentStatus={page.status}
                        action={
                          page.status === "published"
                            ? unpublishLandingPage.bind(null, page.id)
                            : publishLandingPage.bind(null, page.id)
                        }
                      />
                      <form action={duplicateLandingPage.bind(null, page.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-muted transition-colors duration-150 cursor-pointer"
                        >
                          Duplikasi
                        </button>
                      </form>
                      <Link
                        href={`/admin/landing-pages/${page.id}`}
                        className="inline-flex items-center rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteLandingPage.bind(null, page.id)}
                        confirmMessage={`Hapus LP "${page.internalName || page.slug}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
