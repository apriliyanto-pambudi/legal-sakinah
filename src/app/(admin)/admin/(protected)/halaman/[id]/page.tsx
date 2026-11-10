import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import ContentTextField from "@/components/admin/ContentTextField";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import {
  publishPage,
  unpublishPage,
  updatePage,
  updateKontakPage,
  updatePrivasiPage,
  updateTentangPage,
} from "@/server/actions/pages";
import { requireAdmin } from "@/server/auth/guard";
import { getPageByIdForAdmin } from "@/server/db/queries/pages";
import {
  getKontakSettings,
  getTentangSettings,
} from "@/server/db/queries/site-settings";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}

// ── Defaults Tentang ─────────────────────────────────────────────────────────
const DEFAULT_BANNER_DESC =
  "Firma hukum keluarga yang berdiri dengan satu keyakinan: setiap orang berhak mendapatkan pendampingan hukum yang profesional sekaligus manusiawi.";

const DEFAULT_PRACTICE_AREAS = `Proses Perceraian (cerai talak & cerai gugat)
Hak Asuh Anak (hadhanah)
Nafkah & Harta Bersama
Isbat Nikah
Waris Keluarga
KDRT & Perlindungan Hukum`;

const DEFAULT_NILAI_TEXT = `Profesionalisme
Setiap perkara ditangani dengan standar etika profesi advokat yang ketat, didukung pemahaman mendalam terhadap hukum keluarga.

Empati
Kami memahami bahwa di balik berkas perkara ada manusia yang sedang menghadapi masa paling berat. Kami mendengar, bukan hanya memproses.

Kejujuran
Kami tidak menjanjikan hasil yang tidak bisa kami pastikan. Klien mendapat gambaran realistis sejak awal agar dapat membuat keputusan yang tepat.

Kerahasiaan
Setiap informasi yang Anda bagikan terlindungi oleh prinsip kerahasiaan advokat-klien. Privasi Anda adalah prioritas mutlak.`;

// ── Defaults Kontak ───────────────────────────────────────────────────────────
const DEFAULT_KONTAK_BANNER =
  "Ceritakan situasi Anda. Langkah pertama adalah percakapan — tanpa tekanan, tanpa komitmen.";

// ─────────────────────────────────────────────────────────────────────────────

export default async function EditHalamanPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error, saved } = await searchParams;
  const page = await getPageByIdForAdmin(id);
  if (!page) notFound();

  const isTentang = page.slug === "tentang";
  const isKontak = page.slug === "kontak";
  const isPrivasi = page.slug === "kebijakan-privasi";

  const tentang = isTentang ? await getTentangSettings() : null;
  const kontak = isKontak ? await getKontakSettings() : null;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/halaman"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Halaman situs
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

      {saved ? <AdminAlert message="Perubahan tersimpan." variant="success" /> : null}
      <AdminAlert message={error} />

      {/* ── Form Tentang ── */}
      {isTentang && tentang ? (
        <form
          action={updateTentangPage.bind(null, id)}
          className="space-y-5 rounded-lg border border-border bg-surface p-6"
        >
          <p className="text-xs text-text-muted">
            Kosongkan field untuk memakai teks bawaan website. Perubahan tampil setelah disimpan + status Tayang.
          </p>
          <div>
            <label htmlFor="title" className={adminLabelClass}>
              Judul <span className="text-red-500">*</span>
            </label>
            <input id="title" name="title" type="text" required defaultValue={page.title} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor="tentang_banner_desc" className={adminLabelClass}>Kalimat pembuka</label>
            <textarea
              id="tentang_banner_desc" name="tentang_banner_desc" rows={2}
              defaultValue={tentang.bannerDesc || DEFAULT_BANNER_DESC}
              className={`${adminInputClass} resize-y`}
            />
            <p className="mt-1 text-xs text-text-muted">Teks singkat di bawah judul "Tentang Kami".</p>
          </div>
          <div>
            <label htmlFor="tentang_practice_areas" className={adminLabelClass}>Area praktik utama</label>
            <textarea
              id="tentang_practice_areas" name="tentang_practice_areas" rows={7}
              defaultValue={tentang.practiceAreas || DEFAULT_PRACTICE_AREAS}
              className={`${adminInputClass} resize-y leading-relaxed`}
            />
            <p className="mt-1 text-xs text-text-muted">Satu baris = satu poin.</p>
          </div>
          <div>
            <label htmlFor="tentang_nilai_text" className={adminLabelClass}>Nilai / Prinsip kami</label>
            <textarea
              id="tentang_nilai_text" name="tentang_nilai_text" rows={14}
              defaultValue={tentang.nilaiText || DEFAULT_NILAI_TEXT}
              className={`${adminInputClass} resize-y leading-relaxed font-mono text-xs`}
            />
            <p className="mt-1 text-xs text-text-muted">
              Format: baris pertama = judul, baris kedua = deskripsi, pisahkan tiap poin dengan <strong>baris kosong</strong>.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
            <Link href="/admin/halaman" className={adminBtnGhostClass}>Batal</Link>
            <button type="submit" className={adminBtnPrimaryClass}>Simpan</button>
          </div>
        </form>

      /* ── Form Kontak ── */
      ) : isKontak && kontak ? (
        <form
          action={updateKontakPage.bind(null, id)}
          className="space-y-5 rounded-lg border border-border bg-surface p-6"
        >
          <div className="rounded-md bg-muted px-4 py-3 text-xs text-text-muted">
            Nomor WA, email, alamat, dan jam diubah di <strong>Pengaturan</strong>.
          </div>
          <div>
            <label htmlFor="title" className={adminLabelClass}>
              Judul <span className="text-red-500">*</span>
            </label>
            <input id="title" name="title" type="text" required defaultValue={page.title} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor="kontak_banner_desc" className={adminLabelClass}>Kalimat pembuka</label>
            <textarea
              id="kontak_banner_desc" name="kontak_banner_desc" rows={2}
              defaultValue={kontak.bannerDesc || DEFAULT_KONTAK_BANNER}
              className={`${adminInputClass} resize-y`}
            />
            <p className="mt-1 text-xs text-text-muted">Teks singkat di bawah judul "Hubungi Kami".</p>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
            <Link href="/admin/halaman" className={adminBtnGhostClass}>Batal</Link>
            <button type="submit" className={adminBtnPrimaryClass}>Simpan</button>
          </div>
        </form>

      /* ── Form Kebijakan Privasi ── */
      ) : isPrivasi ? (
        <form
          action={updatePrivasiPage.bind(null, id)}
          className="space-y-5 rounded-lg border border-border bg-surface p-6"
        >
          <p className="text-xs text-text-muted">
            Kosongkan "Isi kebijakan" untuk memakai teks bawaan. Perubahan tampil setelah disimpan + status Tayang.
          </p>
          <div>
            <label htmlFor="title" className={adminLabelClass}>
              Judul <span className="text-red-500">*</span>
            </label>
            <input id="title" name="title" type="text" required defaultValue={page.title} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor="content" className={adminLabelClass}>Isi kebijakan</label>
            <textarea
              id="content" name="content" rows={20}
              defaultValue={""}
              placeholder={"Tulis isi kebijakan privasi di sini.\n\nGunakan baris kosong untuk memisahkan paragraf."}
              className={`${adminInputClass} resize-y leading-relaxed`}
            />
            <p className="mt-1 text-xs text-text-muted">Kosong = teks bawaan website tetap tampil.</p>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
            <Link href="/admin/halaman" className={adminBtnGhostClass}>Batal</Link>
            <button type="submit" className={adminBtnPrimaryClass}>Simpan</button>
          </div>
        </form>

      /* ── Form generik (halaman lain) ── */
      ) : (
        <form
          action={updatePage.bind(null, id)}
          className="space-y-5 rounded-lg border border-border bg-surface p-6"
        >
          <div>
            <label htmlFor="title" className={adminLabelClass}>
              Judul <span className="text-red-500">*</span>
            </label>
            <input id="title" name="title" type="text" required defaultValue={page.title} className={adminInputClass} />
          </div>
          <div>
            <p className={adminLabelClass}>Slug</p>
            <p className="font-mono text-sm text-text-muted">/{page.slug}</p>
          </div>
          <ContentTextField
            defaultHtml={page.content}
            rows={16}
            placeholder={"Contoh:\nIsi halaman..."}
            hint="Biarkan kosong untuk memakai tampilan bawaan website. Isi baru tampil setelah status Tayang."
          />
          <div>
            <label htmlFor="seoTitle" className={adminLabelClass}>SEO Title</label>
            <input id="seoTitle" name="seoTitle" type="text" defaultValue={page.seoTitle ?? ""} className={adminInputClass} />
          </div>
          <div>
            <label htmlFor="seoDescription" className={adminLabelClass}>SEO Description</label>
            <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={page.seoDescription ?? ""} className={`${adminInputClass} resize-y`} />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
            <Link href="/admin/halaman" className={adminBtnGhostClass}>Batal</Link>
            <button type="submit" className={adminBtnPrimaryClass}>Simpan</button>
          </div>
        </form>
      )}
    </div>
  );
}
