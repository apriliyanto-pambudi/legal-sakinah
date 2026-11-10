import AdminAlert from "@/components/admin/AdminAlert";
import PhotoUploadField from "@/components/admin/PhotoUploadField";
import {
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { updateHomeHero } from "@/server/actions/home";
import { requireAdmin } from "@/server/auth/guard";
import { getHomeHeroSettings } from "@/server/db/queries/site-settings";

interface Props {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

export default async function AdminBerandaPage({ searchParams }: Props) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const hero = await getHomeHeroSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Beranda
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Copy hero, foto portrait, dan foto section konsultasi di halaman
          utama.
        </p>
      </div>

      {saved ? (
        <AdminAlert message="Perubahan tersimpan." variant="success" />
      ) : null}
      {error ? <AdminAlert message={error} variant="error" /> : null}

      <form
        action={updateHomeHero}
        className="space-y-5 rounded-lg border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="hero_headline" className={adminLabelClass}>
            Headline
          </label>
          <textarea
            id="hero_headline"
            name="hero_headline"
            rows={2}
            defaultValue={hero.hero_headline}
            className={`${adminInputClass} resize-y`}
          />
        </div>
        <div>
          <label htmlFor="hero_description" className={adminLabelClass}>
            Deskripsi
          </label>
          <textarea
            id="hero_description"
            name="hero_description"
            rows={3}
            defaultValue={hero.hero_description}
            className={`${adminInputClass} resize-y`}
          />
        </div>
        <div>
          <label htmlFor="hero_supporting_text" className={adminLabelClass}>
            Baris pendukung{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <input
            id="hero_supporting_text"
            name="hero_supporting_text"
            type="text"
            defaultValue={hero.hero_supporting_text}
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="hero_cta_text" className={adminLabelClass}>
            Teks CTA
          </label>
          <input
            id="hero_cta_text"
            name="hero_cta_text"
            type="text"
            defaultValue={hero.hero_cta_text}
            className={adminInputClass}
          />
        </div>
        <PhotoUploadField
          currentUrl={hero.hero_photo_url || null}
          label="Foto portrait hero"
          fileInputName="hero_photo"
          hiddenName="hero_photo_url"
          hint="JPEG, PNG, atau WebP · Maks 5 MB"
          previewClassName="h-56 w-40"
          alt="Foto hero beranda"
        />
        <PhotoUploadField
          currentUrl={hero.mid_cta_photo_url || null}
          label="Foto mid-CTA (kotak konsultasi)"
          fileInputName="mid_cta_photo"
          hiddenName="mid_cta_photo_url"
          hint="JPEG, PNG, atau WebP · Maks 5 MB · Tampil di section konsultasi beranda"
          previewClassName="h-40 w-40"
          alt="Foto mid-CTA beranda"
        />
        <div className="flex justify-end border-t border-border pt-2">
          <button type="submit" className={adminBtnPrimaryClass}>
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
