import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import DeleteButton from "@/components/admin/DeleteButton";
import LpBlockFields from "@/components/admin/LpBlockFields";
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

const BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "problem", label: "Masalah" },
  { value: "solution", label: "Solusi" },
  { value: "process", label: "Proses" },
  { value: "proof", label: "Bukti" },
  { value: "faq", label: "FAQ" },
  { value: "cta", label: "CTA" },
  { value: "custom_html", label: "HTML kustom" },
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
          Meta
        </Link>
        <Link
          href={`/admin/landing-pages/${id}?tab=blocks`}
          className={`rounded-md px-3 py-1.5 text-sm ${
            showBlocks ? "bg-primary text-white" : "text-text-muted hover:bg-muted"
          }`}
        >
          Blok ({blocks.length})
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
          <form
            action={addBlockWithId}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
          >
            <div className="min-w-40 flex-1">
              <label htmlFor="blockType" className={adminLabelClass}>
                Tipe blok
              </label>
              <select id="blockType" name="blockType" className={`${adminInputClass} bg-white`}>
                {BLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label htmlFor="sortOrder" className={adminLabelClass}>
                Urutan
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={blocks.length}
                className={adminInputClass}
              />
            </div>
            <button type="submit" className={adminBtnPrimaryClass}>
              Tambah blok
            </button>
          </form>

          {blocks.length === 0 ? (
            <p className="text-sm text-text-muted">
              Belum ada blok. Tambahkan hero, masalah, solusi, dan CTA.
            </p>
          ) : (
            blocks.map((block) => (
              <form
                key={block.id}
                action={updateBlock.bind(null, block.id, id)}
                className="space-y-4 rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold capitalize text-primary">
                    {block.blockType}
                  </p>
                  <div className="flex items-center gap-2">
                    <select
                      name="isVisible"
                      defaultValue={block.isVisible ? "true" : "false"}
                      className={`${adminInputClass} w-auto bg-white`}
                    >
                      <option value="true">Tampil</option>
                      <option value="false">Sembunyi</option>
                    </select>
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={block.sortOrder}
                      className={`${adminInputClass} w-20`}
                      aria-label="Urutan blok"
                    />
                  </div>
                </div>

                <LpBlockFields blockType={block.blockType} content={block.content} />

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <DeleteButton
                    action={deleteBlock.bind(null, block.id, id)}
                    confirmMessage="Hapus blok ini?"
                  />
                  <button type="submit" className={adminBtnPrimaryClass}>
                    Simpan blok
                  </button>
                </div>
              </form>
            ))
          )}
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
              className={`${adminInputClass} font-mono`}
            />
            {lp.status === "published" ? (
              <p className="mt-1 text-xs text-amber-700">
                Mengubah slug LP yang sudah tayang akan memutus URL iklan lama.
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
              Nomor WA override
            </label>
            <input
              id="whatsappNumberOverride"
              name="whatsappNumberOverride"
              type="text"
              defaultValue={lp.whatsappNumberOverride ?? ""}
              className={adminInputClass}
            />
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
