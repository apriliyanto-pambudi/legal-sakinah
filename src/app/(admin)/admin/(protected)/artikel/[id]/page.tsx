import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import ContentTextField from "@/components/admin/ContentTextField";
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
  deleteArticle,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "@/server/actions/articles";
import { requireAdmin } from "@/server/auth/guard";
import { getArticleByIdForAdmin } from "@/server/db/queries/articles";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditArtikelPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const item = await getArticleByIdForAdmin(id);
  if (!item) notFound();

  const updateWithId = updateArticle.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/artikel"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Artikel
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">
            Edit Artikel
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          <PublishButton
            currentStatus={item.status}
            action={
              item.status === "published"
                ? unpublishArticle.bind(null, id)
                : publishArticle.bind(null, id)
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
          <label htmlFor="title" className={adminLabelClass}>
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={item.title}
            className={adminInputClass}
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
            defaultValue={item.slug}
            className={`${adminInputClass} font-mono`}
          />
          {item.status === "published" && (
            <p className="mt-1 text-xs text-amber-600">
              Hati-hati — artikel sudah tayang. Mengubah slug akan memutus
              tautan lama.
            </p>
          )}
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
            defaultValue={item.excerpt ?? ""}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <ContentTextField
          defaultHtml={item.content}
          rows={16}
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
            defaultValue={item.seoTitle ?? ""}
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
            defaultValue={item.seoDescription ?? ""}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <DeleteButton
            action={deleteArticle.bind(null, id)}
            confirmMessage="Hapus artikel ini?"
          />
          <div className="flex items-center gap-3">
            <Link href="/admin/artikel" className={adminBtnGhostClass}>
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
