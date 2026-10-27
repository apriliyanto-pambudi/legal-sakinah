import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { createLandingPage } from "@/server/actions/landing-pages";
import { requireAdmin } from "@/server/auth/guard";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewLandingPagePage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/landing-pages"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Landing Pages
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">
          Tambah Landing Page
        </h1>
      </div>

      <AdminAlert message={error} />

      <form action={createLandingPage} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="internalName" className={adminLabelClass}>
            Nama internal
          </label>
          <input
            id="internalName"
            name="internalName"
            type="text"
            className={adminInputClass}
            placeholder="Hak Asuh — Google Ads Jakarta"
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
            placeholder="promo-hak-asuh"
          />
        </div>
        <div>
          <label htmlFor="headline" className={adminLabelClass}>
            Headline <span className="text-red-500">*</span>
          </label>
          <input id="headline" name="headline" type="text" required className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="subheadline" className={adminLabelClass}>
            Subheadline
          </label>
          <textarea id="subheadline" name="subheadline" rows={3} className={`${adminInputClass} resize-y`} />
        </div>
        <div>
          <label htmlFor="primaryCtaText" className={adminLabelClass}>
            Teks CTA
          </label>
          <input
            id="primaryCtaText"
            name="primaryCtaText"
            type="text"
            defaultValue="Konsultasi via WhatsApp"
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="whatsappNumberOverride" className={adminLabelClass}>
            Nomor WA override
          </label>
          <input
            id="whatsappNumberOverride"
            name="whatsappNumberOverride"
            type="text"
            className={adminInputClass}
            placeholder="Kosong = pakai pengaturan situs"
          />
        </div>
        <div>
          <label htmlFor="whatsappPrefill" className={adminLabelClass}>
            Prefill WhatsApp
          </label>
          <textarea id="whatsappPrefill" name="whatsappPrefill" rows={2} className={`${adminInputClass} resize-y`} />
        </div>
        <div>
          <label htmlFor="campaignNote" className={adminLabelClass}>
            Catatan kampanye
          </label>
          <textarea id="campaignNote" name="campaignNote" rows={2} className={`${adminInputClass} resize-y`} />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
          <Link href="/admin/landing-pages" className={adminBtnGhostClass}>
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
