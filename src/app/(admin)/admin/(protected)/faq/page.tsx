import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { getAllFaqsForAdmin } from "@/server/db/queries/faqs";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import { publishFaq, unpublishFaq, deleteFaq } from "@/server/actions/faqs";
import { Plus } from "lucide-react";

export default async function AdminFaqPage() {
  await requireAdmin();
  const faqs = await getAllFaqsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">FAQ</h1>
          <p className="text-sm text-text-muted mt-0.5">Kelola pertanyaan yang sering diajukan.</p>
        </div>
        <Link
          href="/admin/faq/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-text-muted text-sm">Belum ada FAQ.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left px-4 py-3 font-semibold text-text">Pertanyaan</th>
                <th className="text-left px-4 py-3 font-semibold text-text hidden md:table-cell">Cakupan</th>
                <th className="text-left px-4 py-3 font-semibold text-text hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-text">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-muted/50 transition-colors duration-100">
                  <td className="px-4 py-3 text-text max-w-xs">
                    <span className="line-clamp-2">{faq.question}</span>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell capitalize">{faq.scope}</td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">{faq.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={faq.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <PublishButton
                        currentStatus={faq.status}
                        action={
                          faq.status === "published"
                            ? unpublishFaq.bind(null, faq.id)
                            : publishFaq.bind(null, faq.id)
                        }
                      />
                      <Link
                        href={`/admin/faq/${faq.id}`}
                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteFaq.bind(null, faq.id)}
                        confirmMessage="Hapus FAQ ini?"
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
