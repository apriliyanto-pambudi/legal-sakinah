import Link from "next/link";
import { Plus } from "lucide-react";
import AdminSortableList from "@/components/admin/AdminSortableList";
import {
  deleteTestimonial,
  publishTestimonial,
  reorderTestimonials,
  unpublishTestimonial,
} from "@/server/actions/testimonials";
import { requireAdmin } from "@/server/auth/guard";
import { getAllTestimonialsForAdmin } from "@/server/db/queries/testimonials";

export default async function AdminTestimoniPage() {
  await requireAdmin();
  const items = await getAllTestimonialsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            Testimoni
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Seret baris untuk mengatur urutan di beranda. Pakai atribusi samar
            (tanpa nama lengkap).
          </p>
        </div>
        <Link
          href="/admin/testimoni/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Testimoni
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-text-muted text-sm">
            Belum ada testimoni di CMS. Beranda masih memakai data default sampai
            ada yang ditayangkan di sini.
          </p>
        </div>
      ) : (
        <AdminSortableList
          reorderAction={reorderTestimonials}
          columnHeaders={[
            { label: "Kutipan" },
            { label: "Atribusi", className: "hidden md:table-cell" },
          ]}
          items={items.map((item) => ({
            id: item.id,
            sortOrder: item.sortOrder,
            status: item.status,
            label: item.attribution,
            editHref: `/admin/testimoni/${item.id}`,
            deleteConfirm: "Hapus testimoni ini?",
            cells: [
              <span key="quote" className="line-clamp-2 text-text">
                {item.quote}
              </span>,
              <span key="attr" className="text-text-muted">
                {item.attribution}
              </span>,
            ],
            publishAction: publishTestimonial.bind(null, item.id),
            unpublishAction: unpublishTestimonial.bind(null, item.id),
            deleteAction: deleteTestimonial.bind(null, item.id),
          }))}
        />
      )}
    </div>
  );
}
