import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import DeleteButton from "@/components/admin/DeleteButton";
import LpBlockList from "@/components/admin/LpBlockList";
import PhotoUploadField from "@/components/admin/PhotoUploadField";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import {
  addBlock,
  deleteBlock,
  deleteLandingPage,
  publishLandingPage,
  unpublishLandingPage,
  updateBlock,
  updateLandingPageMeta,
} from "@/server/actions/landing-pages";
import { requireAdmin } from "@/server/auth/guard";
import { getLandingPageByIdForAdmin } from "@/server/db/queries/landing-pages";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; tab?: string }>;
}

/** LP ads: bagian yang bisa ditambah (hero disembunyikan — slot existing tetap render). */
const ADDABLE_BLOCK_TYPES = [
  { value: "image_cards", label: "Deretan foto" },
  { value: "cta", label: "Tombol WhatsApp" },
];

export default async function EditLandingPagePage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error, saved, tab } = await searchParams;
  const record = await getLandingPageByIdForAdmin(id);
  if (!record) notFound();

  const { lp, blocks } = record;
  const showBlocks = tab === "blocks";
  const updateMeta = updateLandingPageMeta.bind(null, id);
  const addBlockWithId = addBlock.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/landing-pages"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Landing Pages
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">
            {lp.internalName || lp.slug}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={lp.status} />
          <PublishButton
            currentStatus={lp.status}
            action={
              lp.status === "published"
                ? unpublishLandingPage.bind(null, id)
                : publishLandingPage.bind(null, id)
            }
          />
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        <Link
          href={`/admin/landing-pages/${id}`}
          className={`rounded-md px-3 py-1.5 text-sm ${
            showBlocks ? "text-text-muted hover:bg-muted" : "bg-primary text-white"
          }`}
        >
          Pengaturan
        </Link>
        <Link
          href={`/admin/landing-pages/${id}?tab=blocks`}
          className={`rounded-md px-3 py-1.5 text-sm ${
            showBlocks ? "bg-primary text-white" : "text-text-muted hover:bg-muted"
          }`}
        >
          Isi halaman ({blocks.length})
        </Link>
        {lp.status === "published" ? (
          <Link
            href={`/${lp.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:bg-muted"
          >
            Lihat publik
          </Link>
        ) : null}
      </div>

      <AdminAlert message={error} />
      {saved ? <AdminAlert message="Tersimpan." variant="success" /> : null}

      {showBlocks ? (
        <div className="space-y-6">
          {/* ── Tambah bagian baru ── */}
          <form
            action={addBlockWithId}
            className="rounded-lg border border-border bg-surface p-4 space-y-3"
          >
            <p className="text-sm font-semibold text-primary">Tambah bagian</p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-48 flex-1">
                <label htmlFor="blockType" className={adminLabelClass}>
                  Pilih tipe
                </label>
                <select id="blockType" name="blockType" className={`${adminInputClass} bg-white`}>
                  {ADDABLE_BLOCK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* sortOrder otomatis dari jumlah blok sekarang */}
              <input type="hidden" name="sortOrder" value={blocks.length} />
              <button type="submit" className={adminBtnPrimaryClass}>
                + Tambah
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Urutan bisa diatur ulang dengan drag & drop setelah bagian ditambah.
            </p>
          </form>

          {/* ── Daftar blok dengan drag-drop ── */}
          <LpBlockList
            landingPageId={id}
            blocks={blocks.map((block) => ({
              id: block.id,
              blockType: block.blockType,
              content: block.content,
              sortOrder: block.sortOrder,
              isVisible: block.isVisible,
              updateAction: updateBlock.bind(null, block.id, id),
              deleteAction: deleteBlock.bind(null, block.id, id),
            }))}
          />
        </div>
      ) : (
        <form action={updateMeta} className="space-y-5 rounded-lg border border-border bg-surface p-6">
          <div>
            <label htmlFor="internalName" className={adminLabelClass}>
              Nama internal
            </label>
            <input
              id="internalName"
              name="internalName"
              type="text"
              defaultValue={lp.internalName ?? ""}
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
              defaultValue={lp.slug}
              readOnly={lp.status === "published"}
              className={`${adminInputClass} font-mono${
                lp.status === "published" ? " bg-muted cursor-not-allowed" : ""
              }`}
            />
            {lp.status === "published" ? (
              <p className="mt-1 text-xs text-amber-700">
                Slug terkunci karena LP sudah tayang. Mengubahnya akan memutus URL
                iklan lama — unpublish dulu jika harus ganti.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="headline" className={adminLabelClass}>
              Headline <span className="text-red-500">*</span>
            </label>
            <input
              id="headline"
              name="headline"
              type="text"
              required
              defaultValue={lp.headline}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="subheadline" className={adminLabelClass}>
              Subheadline
            </label>
            <textarea
              id="subheadline"
              name="subheadline"
              rows={3}
              defaultValue={lp.subheadline ?? ""}
              className={`${adminInputClass} resize-y`}
            />
          </div>
          <PhotoUploadField
            currentUrl={lp.heroImageUrl}
            label="Gambar banner"
            fileInputName="heroBannerFile"
            hiddenName="heroImageUrl"
            hint="JPEG, PNG, atau WebP · Maks 5 MB · Kosongkan untuk hero teks saja"
            previewClassName="h-40 w-full max-w-sm"
            alt="Preview banner"
          />
          <div>
            <label htmlFor="primaryCtaText" className={adminLabelClass}>
              Teks CTA
            </label>
            <input
              id="primaryCtaText"
              name="primaryCtaText"
              type="text"
              defaultValue={lp.primaryCtaText}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="whatsappNumberOverride" className={adminLabelClass}>
              Nomor WhatsApp untuk LP ini
            </label>
            <input
              id="whatsappNumberOverride"
              name="whatsappNumberOverride"
              type="tel"
              inputMode="tel"
              defaultValue={lp.whatsappNumberOverride ?? ""}
              className={adminInputClass}
              placeholder="62812…"
            />
            <p className="mt-1 text-xs text-text-muted">
              Format 62812… · Kosong = pakai nomor default situs
            </p>
          </div>
          <div>
            <label htmlFor="whatsappPrefill" className={adminLabelClass}>
              Prefill WhatsApp
            </label>
            <textarea
              id="whatsappPrefill"
              name="whatsappPrefill"
              rows={2}
              defaultValue={lp.whatsappPrefill ?? ""}
              className={`${adminInputClass} resize-y`}
            />
          </div>
          <div>
            <label htmlFor="campaignNote" className={adminLabelClass}>
              Catatan kampanye
            </label>
            <textarea
              id="campaignNote"
              name="campaignNote"
              rows={2}
              defaultValue={lp.campaignNote ?? ""}
              className={`${adminInputClass} resize-y`}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <DeleteButton
              action={deleteLandingPage.bind(null, id)}
              confirmMessage={`Hapus LP "${lp.internalName || lp.slug}"?`}
            />
            <div className="flex items-center gap-3">
              <Link href="/admin/landing-pages" className={adminBtnGhostClass}>
                Batal
              </Link>
              <button type="submit" className={adminBtnPrimaryClass}>
                Simpan
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
