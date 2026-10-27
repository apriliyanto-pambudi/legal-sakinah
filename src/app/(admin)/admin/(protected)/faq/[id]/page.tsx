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
import { deleteFaq, publishFaq, unpublishFaq, updateFaq } from "@/server/actions/faqs";
import { requireAdmin } from "@/server/auth/guard";
import { getFaqByIdForAdmin } from "@/server/db/queries/faqs";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditFaqPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const faq = await getFaqByIdForAdmin(id);
  if (!faq) notFound();

  const updateWithId = updateFaq.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/faq"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            FAQ
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">Edit FAQ</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={faq.status} />
          <PublishButton
            currentStatus={faq.status}
            action={
              faq.status === "published"
                ? unpublishFaq.bind(null, id)
                : publishFaq.bind(null, id)
            }
          />
        </div>
      </div>

      <AdminAlert message={error} />

      <form action={updateWithId} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="question" className={adminLabelClass}>
            Pertanyaan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question"
            name="question"
            rows={2}
            required
            defaultValue={faq.question}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="answer" className={adminLabelClass}>
            Jawaban <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={5}
            required
            defaultValue={faq.answer}
            className={`${adminInputClass} resize-y`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={adminLabelClass}>
              Kategori
            </label>
            <input
              id="category"
              name="category"
              type="text"
              defaultValue={faq.category ?? ""}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="scope" className={adminLabelClass}>
              Cakupan
            </label>
            <select
              id="scope"
              name="scope"
              defaultValue={faq.scope}
              className={`${adminInputClass} bg-white`}
            >
              <option value="global">Global</option>
              <option value="service">Per Layanan</option>
              <option value="landing_page">Per Landing Page</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sortOrder" className={adminLabelClass}>
            Urutan
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={faq.sortOrder}
            className={adminInputClass}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <DeleteButton
            action={deleteFaq.bind(null, id)}
            confirmMessage="Hapus FAQ ini?"
          />
          <div className="flex items-center gap-3">
            <Link href="/admin/faq" className={adminBtnGhostClass}>
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
