import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import {
  deleteTestimonial,
  publishTestimonial,
  unpublishTestimonial,
  updateTestimonial,
} from "@/server/actions/testimonials";
import { requireAdmin } from "@/server/auth/guard";
import { getTestimonialByIdForAdmin } from "@/server/db/queries/testimonials";
import { getAllServicesForAdmin } from "@/server/db/queries/services";
import { getPublishedServices } from "@/lib/content/services";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditTestimoniPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const item = await getTestimonialByIdForAdmin(id);
  if (!item) notFound();

  const dbServices = await getAllServicesForAdmin();
  const layananOptions =
    dbServices.length > 0
      ? dbServices.map((s) => ({ slug: s.slug, title: s.title }))
      : getPublishedServices().map((s) => ({ slug: s.slug, title: s.title }));
  const knownSlugs = new Set(layananOptions.map((s) => s.slug));
  const orphanSlug =
    item.serviceSlug && !knownSlugs.has(item.serviceSlug)
      ? item.serviceSlug
      : null;

  const updateWithId = updateTestimonial.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/testimoni"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Testimoni
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">
            Edit Testimoni
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          <PublishButton
            currentStatus={item.status}
            action={
              item.status === "published"
                ? unpublishTestimonial.bind(null, id)
                : publishTestimonial.bind(null, id)
            }
          />
        </div>
      </div>

      <AdminAlert message={error} />

      <form
        action={updateWithId}
        className="space-y-5 rounded-lg border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="quote" className={adminLabelClass}>
            Kutipan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="quote"
            name="quote"
            rows={4}
            required
            defaultValue={item.quote}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="attribution" className={adminLabelClass}>
            Atribusi <span className="text-red-500">*</span>
          </label>
          <input
            id="attribution"
            name="attribution"
            type="text"
            required
            maxLength={120}
            defaultValue={item.attribution}
            className={adminInputClass}
          />
          <p className="mt-1 text-xs text-text-muted">
            Identitas samar saja — jangan tulis nama lengkap.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceSlug" className={adminLabelClass}>
              Layanan{" "}
              <span className="font-normal text-text-muted">(opsional)</span>
            </label>
            <select
              id="serviceSlug"
              name="serviceSlug"
              defaultValue={item.serviceSlug ?? ""}
              className={`${adminInputClass} bg-white`}
            >
              <option value="">— Tidak terkait layanan —</option>
              {orphanSlug ? (
                <option value={orphanSlug}>{orphanSlug} (lama)</option>
              ) : null}
              {layananOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className={adminLabelClass}>
              Urutan
            </label>
            <input
              id="sortOrder"
              type="number"
              readOnly
              defaultValue={item.sortOrder}
              className={`${adminInputClass} bg-muted/50 text-text-muted cursor-not-allowed`}
              aria-describedby="sortOrder-hint"
            />
            <p id="sortOrder-hint" className="mt-1 text-xs text-text-muted">
              Hanya baca. Ubah urutan dengan drag &amp; drop di daftar Testimoni.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <DeleteButton
            action={deleteTestimonial.bind(null, id)}
            confirmMessage="Hapus testimoni ini?"
          />
          <div className="flex items-center gap-3">
            <Link href="/admin/testimoni" className={adminBtnGhostClass}>
              Batal
            </Link>
            <button type="submit" className={adminBtnPrimaryClass}>
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
