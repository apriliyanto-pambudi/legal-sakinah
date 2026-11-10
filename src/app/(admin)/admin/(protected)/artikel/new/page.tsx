import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ContentTextField from "@/components/admin/ContentTextField";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { createArticle } from "@/server/actions/articles";
import { requireAdmin } from "@/server/auth/guard";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewArtikelPage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/artikel"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Artikel
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">
          Tambah Artikel
        </h1>
      </div>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <form
        action={createArticle}
        className="rounded-lg border border-border bg-surface p-6 space-y-5"
      >
        <div>
          <label htmlFor="title" className={adminLabelClass}>
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={adminInputClass}
            placeholder="Memahami Proses Perceraian di Pengadilan Agama"
          />
        </div>

        <div>
          <label htmlFor="slug" className={adminLabelClass}>
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className={`${adminInputClass} font-mono`}
            placeholder="memahami-proses-perceraian"
          />
          <p className="mt-1 text-xs text-text-muted">
            Huruf kecil, angka, tanda hubung saja. Dipakai di URL:{" "}
            <code className="font-mono">/artikel/[slug]</code>
          </p>
        </div>

        <div>
          <label htmlFor="excerpt" className={adminLabelClass}>
            Ringkasan{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            className={`${adminInputClass} resize-y`}
            placeholder="Deskripsi singkat yang tampil di daftar artikel..."
          />
        </div>

        <ContentTextField
          rows={16}
          placeholder={
            "Tulis isi artikel di sini.\n\n## Subjudul\n\nParagraf baru dipisah baris kosong.\n\n- Poin pertama\n- Poin kedua"
          }
          hint="Isi baru tampil di website setelah status Tayang."
        />

        <div>
          <label htmlFor="seoTitle" className={adminLabelClass}>
            SEO Title{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            className={adminInputClass}
          />
        </div>

        <div>
          <label htmlFor="seoDescription" className={adminLabelClass}>
            SEO Description{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Link href="/admin/artikel" className={adminBtnGhostClass}>
            Batal
          </Link>
          <button type="submit" className={adminBtnPrimaryClass}>
            Simpan sebagai Draft
          </button>
        </div>
      </form>
    </div>
  );
}
