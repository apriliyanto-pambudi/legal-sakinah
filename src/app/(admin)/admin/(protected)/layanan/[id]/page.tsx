import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/guard";
import { getServiceByIdForAdmin } from "@/server/db/queries/services";
import { updateService, deleteService, publishService, unpublishService } from "@/server/actions/services";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditLayananPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const service = await getServiceByIdForAdmin(id);
  if (!service) notFound();

  const updateWithId = updateService.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/layanan"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Layanan
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">Edit Layanan</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={service.status} />
          <PublishButton
            currentStatus={service.status}
            action={
              service.status === "published"
                ? unpublishService.bind(null, id)
                : publishService.bind(null, id)
            }
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={updateWithId} className="rounded-lg border border-border bg-surface p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text mb-1.5">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={service.title}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-text mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={service.slug}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          {service.status === "published" && (
            <p className="mt-1 text-xs text-amber-600">
              Mengubah slug layanan yang sudah tayang akan memutus URL lama.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-text mb-1.5">
            Ikon Lucide
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            defaultValue={service.icon ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="Scale / Heart / Landmark / FileText / Users / Shield"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-text mb-1.5">
            Ringkasan
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={service.summary ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-text mb-1.5">
            Konten <span className="text-text-muted text-xs font-normal">(HTML)</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={14}
            defaultValue={service.content ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-text mb-1.5">
              SEO Title
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              type="text"
              defaultValue={service.seoTitle ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-text mb-1.5">
              Urutan
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={service.sortOrder}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-text mb-1.5">
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={service.seoDescription ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <DeleteButton
            action={deleteService.bind(null, id)}
            confirmMessage={`Hapus layanan "${service.title}"? Tindakan ini tidak bisa dibatalkan.`}
          />
          <div className="flex items-center gap-3">
            <Link
              href="/admin/layanan"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-muted transition-colors duration-150"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-150"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
