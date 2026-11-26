import AdminAlert from "@/components/admin/AdminAlert";
import {
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { updateSiteSettings } from "@/server/actions/site-settings";
import { requireAdmin } from "@/server/auth/guard";
import { getAllSettings } from "@/server/db/queries/site-settings";

interface Props {
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminPengaturanPage({ searchParams }: Props) {
  await requireAdmin();
  const { saved } = await searchParams;
  const settings = await getAllSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Pengaturan Situs
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Nomor WhatsApp dan prefill default dipakai seluruh CTA, kecuali LP
          yang punya override.
        </p>
      </div>

      {saved ? <AdminAlert message="Pengaturan tersimpan." variant="success" /> : null}

      <form action={updateSiteSettings} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="site_name" className={adminLabelClass}>
            Nama situs
          </label>
          <input
            id="site_name"
            name="site_name"
            type="text"
            defaultValue={settings.site_name}
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="site_tagline" className={adminLabelClass}>
            Tagline
          </label>
          <input
            id="site_tagline"
            name="site_tagline"
            type="text"
            defaultValue={settings.site_tagline}
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="site_motto" className={adminLabelClass}>
            Motto
          </label>
          <input
            id="site_motto"
            name="site_motto"
            type="text"
            defaultValue={settings.site_motto || "Amanah Menuntaskan"}
            className={adminInputClass}
            placeholder="Amanah Menuntaskan"
          />
        </div>
        <div>
          <label htmlFor="site_description" className={adminLabelClass}>
            Deskripsi situs
          </label>
          <textarea
            id="site_description"
            name="site_description"
            rows={4}
            defaultValue={settings.site_description}
            className={`${adminInputClass} resize-y`}
            placeholder="Deskripsi singkat untuk SEO dan ringkasan situs"
          />
        </div>
        <div>
          <label htmlFor="instagram_url" className={adminLabelClass}>
            Instagram URL{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <input
            id="instagram_url"
            name="instagram_url"
            type="url"
            defaultValue={settings.instagram_url}
            className={adminInputClass}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label htmlFor="facebook_url" className={adminLabelClass}>
            Facebook URL{" "}
            <span className="font-normal text-text-muted">(opsional)</span>
          </label>
          <input
            id="facebook_url"
            name="facebook_url"
            type="url"
            defaultValue={settings.facebook_url}
            className={adminInputClass}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label htmlFor="whatsapp_number_default" className={adminLabelClass}>
            Nomor WhatsApp default
          </label>
          <input
            id="whatsapp_number_default"
            name="whatsapp_number_default"
            type="text"
            defaultValue={settings.whatsapp_number_default}
            className={`${adminInputClass} font-mono`}
            placeholder="6281234567890"
          />
          <p className="mt-1 text-xs text-text-muted">
            Format internasional tanpa +. Dummy development: 6281234567890.
          </p>
        </div>
        <div>
          <label htmlFor="whatsapp_prefill_default" className={adminLabelClass}>
            Prefill WhatsApp default
          </label>
          <textarea
            id="whatsapp_prefill_default"
            name="whatsapp_prefill_default"
            rows={3}
            defaultValue={settings.whatsapp_prefill_default}
            className={`${adminInputClass} resize-y`}
          />
        </div>
        <div>
          <label htmlFor="office_address" className={adminLabelClass}>
            Alamat kantor
          </label>
          <textarea
            id="office_address"
            name="office_address"
            rows={2}
            defaultValue={settings.office_address}
            className={`${adminInputClass} resize-y`}
          />
        </div>
        <div>
          <label htmlFor="office_hours" className={adminLabelClass}>
            Jam operasional
          </label>
          <input
            id="office_hours"
            name="office_hours"
            type="text"
            defaultValue={settings.office_hours}
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor="contact_email" className={adminLabelClass}>
            Email kontak
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={settings.contact_email}
            className={adminInputClass}
          />
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-primary">Tracking iklan (Landing Page saja)</p>
          <p className="mt-1 text-xs text-text-muted">
            ID di bawah hanya aktif di LP: PageView saat buka halaman, Lead saat klik WhatsApp.
            Kosongkan field yang tidak dipakai. Compro tidak mengirim event ini.
          </p>
        </div>
        <div>
          <label htmlFor="ga4_measurement_id" className={adminLabelClass}>
            GA4 Measurement ID
          </label>
          <input
            id="ga4_measurement_id"
            name="ga4_measurement_id"
            type="text"
            defaultValue={settings.ga4_measurement_id}
            className={`${adminInputClass} font-mono`}
            placeholder="G-XXXXXXXX"
          />
          <p className="mt-1 text-xs text-text-muted">Opsional / cadangan. Utama iklan: tiga field di bawah.</p>
        </div>
        <div>
          <label htmlFor="meta_pixel_id" className={adminLabelClass}>
            Meta Pixel ID
          </label>
          <input
            id="meta_pixel_id"
            name="meta_pixel_id"
            type="text"
            defaultValue={settings.meta_pixel_id}
            className={`${adminInputClass} font-mono`}
            placeholder="123456789012345"
          />
        </div>
        <div>
          <label htmlFor="google_ads_id" className={adminLabelClass}>
            Google Ads ID
          </label>
          <input
            id="google_ads_id"
            name="google_ads_id"
            type="text"
            defaultValue={settings.google_ads_id}
            className={`${adminInputClass} font-mono`}
            placeholder="AW-XXXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="tiktok_pixel_id" className={adminLabelClass}>
            TikTok Pixel ID
          </label>
          <input
            id="tiktok_pixel_id"
            name="tiktok_pixel_id"
            type="text"
            defaultValue={settings.tiktok_pixel_id}
            className={`${adminInputClass} font-mono`}
            placeholder="CXXXXXXXXXXXXXXX"
          />
        </div>
        <div className="flex justify-end border-t border-border pt-2">
          <button type="submit" className={adminBtnPrimaryClass}>
            Simpan pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
