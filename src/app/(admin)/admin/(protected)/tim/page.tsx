import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  deleteTeamMember,
  publishTeamMember,
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
            Kelola profil advokat yang ditampilkan di halaman Tim.
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
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-text">Nama</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-text md:table-cell">
                  Jabatan
                </th>
                <th className="px-4 py-3 text-left font-semibold text-text">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-text">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.id} className="transition-colors duration-100 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-text">{member.name}</td>
                  <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                    {member.roleTitle ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <PublishButton
                        currentStatus={member.status}
                        action={
                          member.status === "published"
                            ? unpublishTeamMember.bind(null, member.id)
                            : publishTeamMember.bind(null, member.id)
                        }
                      />
                      <Link
                        href={`/admin/tim/${member.id}`}
                        className="inline-flex items-center rounded-md border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteTeamMember.bind(null, member.id)}
                        confirmMessage={`Hapus "${member.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
