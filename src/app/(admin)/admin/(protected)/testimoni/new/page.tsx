import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { createTestimonial } from "@/server/actions/testimonials";
import { getAllServicesForAdmin } from "@/server/db/queries/services";
import { getPublishedServices } from "@/lib/content/services";
import { ChevronLeft } from "lucide-react";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewTestimoniPage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;
  const dbServices = await getAllServicesForAdmin();
  const layananOptions =
    dbServices.length > 0
      ? dbServices.map((s) => ({ slug: s.slug, title: s.title }))
      : getPublishedServices().map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/testimoni"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Testimoni
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">
          Tambah Testimoni
        </h1>
      </div>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <form
        action={createTestimonial}
        className="rounded-lg border border-border bg-surface p-6 space-y-5"
      >
        <div>
          <label
            htmlFor="quote"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Kutipan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="quote"
            name="quote"
            rows={4}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
            placeholder="Pengalaman klien secara umum — tanpa janji hasil atau detail perkara."
          />
        </div>

        <div>
          <label
            htmlFor="attribution"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Atribusi <span className="text-red-500">*</span>
          </label>
          <input
            id="attribution"
            name="attribution"
            type="text"
            required
            maxLength={120}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder='Contoh: "Klien, Jawa Barat"'
          />
          <p className="mt-1 text-xs text-text-muted">
            Identitas samar saja — jangan tulis nama lengkap.
          </p>
        </div>

        <div>
          <label
            htmlFor="serviceSlug"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Layanan{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue=""
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white"
          >
            <option value="">— Tidak terkait layanan —</option>
            {layananOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-text-muted rounded-md border border-border bg-muted/40 px-3 py-2">
          Urutan otomatis di akhir daftar. Susun ulang dengan drag &amp; drop di
          halaman Testimoni setelah disimpan.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Link
            href="/admin/testimoni"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-muted transition-colors duration-150"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-150"
          >
            Simpan sebagai Draft
          </button>
        </div>
      </form>
    </div>
  );
}
