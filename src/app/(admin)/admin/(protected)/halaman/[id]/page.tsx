import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { publishPage, unpublishPage, updatePage } from "@/server/actions/pages";
import { requireAdmin } from "@/server/auth/guard";
import { getPageByIdForAdmin } from "@/server/db/queries/pages";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditHalamanPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const page = await getPageByIdForAdmin(id);
  if (!page) notFound();

  const updateWithId = updatePage.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/halaman"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Halaman
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">
            Edit {page.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={page.status} />
          <PublishButton
            currentStatus={page.status}
            action={
              page.status === "published"
                ? unpublishPage.bind(null, id)
                : publishPage.bind(null, id)
            }
          />
        </div>
      </div>

      <AdminAlert message={error} />

      <form action={updateWithId} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="title" className={adminLabelClass}>
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={page.title}
            className={adminInputClass}
          />
        </div>
        <div>
          <p className={adminLabelClass}>Slug</p>
          <p className="font-mono text-sm text-text-muted">/{page.slug}</p>
        </div>
        <div>
          <label htmlFor="content" className={adminLabelClass}>
            Konten <span className="text-xs font-normal text-text-muted">(HTML)</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={16}
            defaultValue={page.content ?? ""}
            className={`${adminInputClass} resize-y font-mono`}
          />
          <p className="mt-1 text-xs text-text-muted">
            Kosongkan untuk memakai tata letak bawaan website. Isi HTML hanya
            tampil publik setelah status Tayang.
          </p>
        </div>
        <div>
          <label htmlFor="seoTitle" className={adminLabelClass}>
            SEO Title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            defaultValue={page.seoTitle ?? ""}
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="seoDescription" className={adminLabelClass}>
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={page.seoDescription ?? ""}
            className={`${adminInputClass} resize-y`}
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
          <Link href="/admin/halaman" className={adminBtnGhostClass}>
            Batal
          </Link>
          <button type="submit" className={adminBtnPrimaryClass}>
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
