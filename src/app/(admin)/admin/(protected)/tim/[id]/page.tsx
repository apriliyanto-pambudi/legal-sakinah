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
import {
  deleteTeamMember,
  publishTeamMember,
  unpublishTeamMember,
  updateTeamMember,
} from "@/server/actions/team";
import { requireAdmin } from "@/server/auth/guard";
import { getTeamMemberByIdForAdmin } from "@/server/db/queries/team";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditTimPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const member = await getTeamMemberByIdForAdmin(id);
  if (!member) notFound();

  const updateWithId = updateTeamMember.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tim"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Tim
          </Link>
          <span className="text-text-muted">/</span>
          <h1 className="font-heading text-xl font-semibold text-primary">Edit Anggota</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={member.status} />
          <PublishButton
            currentStatus={member.status}
            action={
              member.status === "published"
                ? unpublishTeamMember.bind(null, id)
                : publishTeamMember.bind(null, id)
            }
          />
        </div>
      </div>

      <AdminAlert message={error} />

      <form action={updateWithId} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label htmlFor="name" className={adminLabelClass}>
            Nama <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" required defaultValue={member.name} className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="roleTitle" className={adminLabelClass}>
            Jabatan
          </label>
          <input id="roleTitle" name="roleTitle" type="text" defaultValue={member.roleTitle ?? ""} className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="photoUrl" className={adminLabelClass}>
            URL foto
          </label>
          <input id="photoUrl" name="photoUrl" type="text" defaultValue={member.photoUrl ?? ""} className={adminInputClass} />
        </div>
        <div>
          <label htmlFor="bio" className={adminLabelClass}>
            Bio singkat
          </label>
          <textarea id="bio" name="bio" rows={5} defaultValue={member.bio ?? ""} className={`${adminInputClass} resize-y`} />
        </div>
        <div>
          <label htmlFor="expertise" className={adminLabelClass}>
            Keahlian
          </label>
          <input
            id="expertise"
            name="expertise"
            type="text"
            defaultValue={(member.expertise ?? []).join(", ")}
            className={adminInputClass}
          />
          <p className="mt-1 text-xs text-text-muted">Pisahkan dengan koma.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="licenseNumber" className={adminLabelClass}>
              Nomor izin
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              defaultValue={member.licenseNumber ?? ""}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="sortOrder" className={adminLabelClass}>
              Urutan
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={member.sortOrder}
              className={adminInputClass}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <DeleteButton
            action={deleteTeamMember.bind(null, id)}
            confirmMessage={`Hapus "${member.name}"?`}
          />
          <div className="flex items-center gap-3">
            <Link href="/admin/tim" className={adminBtnGhostClass}>
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
