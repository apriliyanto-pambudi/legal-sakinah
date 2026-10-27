import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminAlert from "@/components/admin/AdminAlert";
import {
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";
import { createTeamMember } from "@/server/actions/team";
import { requireAdmin } from "@/server/auth/guard";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewTimPage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/tim"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Tim
        </Link>
        <span className="text-text-muted">/</span>
        <h1 className="font-heading text-xl font-semibold text-primary">
          Tambah Anggota
        </h1>
      </div>

      <AdminAlert message={error} />

      <form action={createTeamMember} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="name" className={adminLabelClass}>
            Nama <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" required className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="roleTitle" className={adminLabelClass}>
            Jabatan
          </label>
          <input id="roleTitle" name="roleTitle" type="text" className={adminInputClass} placeholder="Advokat, Partner" />
        </div>
        <div>
          <label htmlFor="photoUrl" className={adminLabelClass}>
            URL foto
          </label>
          <input id="photoUrl" name="photoUrl" type="text" className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="bio" className={adminLabelClass}>
            Bio singkat
          </label>
          <textarea id="bio" name="bio" rows={5} className={`${adminInputClass} resize-y`} />
        </div>
        <div>
          <label htmlFor="expertise" className={adminLabelClass}>
            Keahlian
          </label>
          <input
            id="expertise"
            name="expertise"
            type="text"
            className={adminInputClass}
            placeholder="Perceraian, Hak Asuh Anak"
          />
          <p className="mt-1 text-xs text-text-muted">Pisahkan dengan koma.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="licenseNumber" className={adminLabelClass}>
              Nomor izin
            </label>
            <input id="licenseNumber" name="licenseNumber" type="text" className={adminInputClass} />
          </div>
          <div>
            <label htmlFor="sortOrder" className={adminLabelClass}>
              Urutan
            </label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className={adminInputClass} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-2">
          <Link href="/admin/tim" className={adminBtnGhostClass}>
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
