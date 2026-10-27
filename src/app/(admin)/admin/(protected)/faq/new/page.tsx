import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { createFaq } from "@/server/actions/faqs";
import { ChevronLeft } from "lucide-react";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewFaqPage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/faq" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150">
          <ChevronLeft className="w-4 h-4" />
          FAQ
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">Tambah FAQ</h1>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={createFaq} className="rounded-lg border border-border bg-surface p-6 space-y-5">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-text mb-1.5">
            Pertanyaan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question"
            name="question"
            rows={2}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-text mb-1.5">
            Jawaban <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={5}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text mb-1.5">
              Kategori
            </label>
            <input
              id="category"
              name="category"
              type="text"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              placeholder="umum / perceraian / hak-asuh / ..."
            />
          </div>
          <div>
            <label htmlFor="scope" className="block text-sm font-medium text-text mb-1.5">
              Cakupan
            </label>
            <select
              id="scope"
              name="scope"
              defaultValue="global"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white"
            >
              <option value="global">Global</option>
              <option value="service">Per Layanan</option>
              <option value="landing_page">Per Landing Page</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-text mb-1.5">
            Urutan
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Link href="/admin/faq" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-muted transition-colors duration-150">
            Batal
          </Link>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-150">
            Simpan sebagai Draft
          </button>
        </div>
      </form>
    </div>
  );
}
