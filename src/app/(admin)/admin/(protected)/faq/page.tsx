import Link from "next/link";
import { Plus } from "lucide-react";
import AdminSortableList from "@/components/admin/AdminSortableList";
import {
  deleteFaq,
  publishFaq,
  reorderFaqs,
  unpublishFaq,
} from "@/server/actions/faqs";
import { requireAdmin } from "@/server/auth/guard";
import { getAllFaqsForAdmin } from "@/server/db/queries/faqs";

export default async function AdminFaqPage() {
  await requireAdmin();
  const faqs = await getAllFaqsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">FAQ</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Seret baris untuk mengatur urutan tampilan FAQ.
          </p>
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
        <AdminSortableList
          reorderAction={reorderFaqs}
          columnHeaders={[
            { label: "Pertanyaan" },
            { label: "Cakupan", className: "hidden md:table-cell" },
            { label: "Kategori", className: "hidden sm:table-cell" },
          ]}
          items={faqs.map((faq) => ({
            id: faq.id,
            sortOrder: faq.sortOrder,
            status: faq.status,
            label: faq.question,
            editHref: `/admin/faq/${faq.id}`,
            deleteConfirm: "Hapus FAQ ini?",
            cells: [
              <span key="q" className="line-clamp-2 text-text max-w-xs inline-block">
                {faq.question}
              </span>,
              <span key="scope" className="text-text-muted capitalize">
                {faq.scope}
              </span>,
              <span key="cat" className="text-text-muted">
                {faq.category ?? "—"}
              </span>,
            ],
            publishAction: publishFaq.bind(null, faq.id),
            unpublishAction: unpublishFaq.bind(null, faq.id),
            deleteAction: deleteFaq.bind(null, faq.id),
          }))}
        />
      )}
    </div>
  );
}
