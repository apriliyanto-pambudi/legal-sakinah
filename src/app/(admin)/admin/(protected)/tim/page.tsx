import Link from "next/link";
import { Plus } from "lucide-react";
import AdminSortableList from "@/components/admin/AdminSortableList";
import {
  deleteTeamMember,
  publishTeamMember,
  reorderTeamMembers,
  unpublishTeamMember,
} from "@/server/actions/team";
import { requireAdmin } from "@/server/auth/guard";
import { getAllTeamForAdmin } from "@/server/db/queries/team";

export default async function AdminTimPage() {
  await requireAdmin();
  const members = await getAllTeamForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">Tim</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Seret baris untuk mengatur urutan profil di halaman Tim.
          </p>
        </div>
        <Link
          href="/admin/tim/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-sm text-text-muted">Belum ada anggota tim.</p>
        </div>
      ) : (
        <AdminSortableList
          reorderAction={reorderTeamMembers}
          columnHeaders={[
            { label: "Nama" },
            { label: "Jabatan", className: "hidden md:table-cell" },
          ]}
          items={members.map((member) => ({
            id: member.id,
            sortOrder: member.sortOrder,
            status: member.status,
            label: member.name,
            editHref: `/admin/tim/${member.id}`,
            deleteConfirm: `Hapus "${member.name}"?`,
            cells: [
              <span key="name" className="font-medium text-text">
                {member.name}
              </span>,
              <span key="role" className="text-text-muted">
                {member.roleTitle ?? "—"}
              </span>,
            ],
            publishAction: publishTeamMember.bind(null, member.id),
            unpublishAction: unpublishTeamMember.bind(null, member.id),
            deleteAction: deleteTeamMember.bind(null, member.id),
          }))}
        />
      )}
    </div>
  );
}
