import Link from "next/link";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { publishPage, unpublishPage } from "@/server/actions/pages";
import { requireAdmin } from "@/server/auth/guard";
import { getAllPagesForAdmin } from "@/server/db/queries/pages";

export default async function AdminHalamanPage() {
  await requireAdmin();
  const pages = await getAllPagesForAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-primary">Halaman</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Perbarui konten Tentang, Kontak, dan Kebijakan Privasi. Draft tidak
          menimpa tampilan publik — halaman memakai tata letak bawaan sampai
          konten CMS ditayangkan.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-sm text-text-muted">
            Belum ada halaman statis. Jalankan <code>pnpm db:seed-cms</code> untuk
            mengisi Tentang, Kontak, dan Kebijakan Privasi.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-text">Judul</th>
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
                  <td className="px-4 py-3 font-medium text-text">{page.title}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-text-muted md:table-cell">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={page.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <PublishButton
                        currentStatus={page.status}
                        action={
                          page.status === "published"
                            ? unpublishPage.bind(null, page.id)
                            : publishPage.bind(null, page.id)
                        }
                      />
                      <Link
                        href={`/admin/halaman/${page.id}`}
                        className="inline-flex items-center rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
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
