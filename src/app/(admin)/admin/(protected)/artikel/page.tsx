import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "@/server/actions/articles";
import { requireAdmin } from "@/server/auth/guard";
import { getAllArticlesForAdmin } from "@/server/db/queries/articles";

export default async function AdminArtikelPage() {
  await requireAdmin();
  const items = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            Artikel
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Kelola artikel edukasi yang tampil di website.
          </p>
        </div>
        <Link
          href="/admin/artikel/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Artikel
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-text-muted text-sm">
            Belum ada artikel di CMS. Beranda memakai artikel bawaan sampai ada
            yang ditayangkan di sini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Judul
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-text md:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-text">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors duration-100 hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-medium text-text">
                    {item.title}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-text-muted md:table-cell">
                    /artikel/{item.slug}
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
                            ? unpublishArticle.bind(null, item.id)
                            : publishArticle.bind(null, item.id)
                        }
                      />
                      <Link
                        href={`/admin/artikel/${item.id}`}
                        className="inline-flex items-center rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteArticle.bind(null, item.id)}
                        confirmMessage="Hapus artikel ini?"
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
