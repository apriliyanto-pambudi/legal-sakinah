import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { createService } from "@/server/actions/services";
import { ChevronLeft } from "lucide-react";
import ContentTextField from "@/components/admin/ContentTextField";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewLayananPage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/layanan"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Layanan
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">Tambah Layanan</h1>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={createService} className="rounded-lg border border-border bg-surface p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text mb-1.5">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="Contoh: Proses Perceraian"
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
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
            placeholder="Deskripsi singkat layanan (tampil di daftar layanan)"
          />
        </div>

        <ContentTextField
          rows={10}
          placeholder={"Contoh:\nKami mendampingi proses ini dari awal hingga putusan.\n\n## Yang kami bantu\n- Konsultasi awal\n- Pendampingan sidang"}
        />

        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-text mb-1.5">
            SEO Title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <p className="text-xs text-text-muted rounded-md border border-border bg-muted/40 px-3 py-2">
          Urutan otomatis di akhir daftar. Susun ulang dengan drag &amp; drop di halaman
          Layanan setelah disimpan.
        </p>

        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-text mb-1.5">
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
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
            Simpan sebagai Draft
          </button>
        </div>
      </form>
    </div>
  );
}
