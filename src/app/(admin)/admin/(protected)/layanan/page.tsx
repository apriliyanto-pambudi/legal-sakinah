import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { getAllServicesForAdmin } from "@/server/db/queries/services";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import { publishService, unpublishService, deleteService } from "@/server/actions/services";
import { Plus } from "lucide-react";

export default async function AdminLayananPage() {
  await requireAdmin();
  const services = await getAllServicesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">Layanan</h1>
          <p className="text-sm text-text-muted mt-0.5">Kelola layanan hukum yang ditampilkan di website.</p>
        </div>
        <Link
          href="/admin/layanan/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-text-muted text-sm">Belum ada layanan. Klik "Tambah Layanan" untuk memulai.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left px-4 py-3 font-semibold text-text">Judul</th>
                <th className="text-left px-4 py-3 font-semibold text-text hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-text hidden sm:table-cell">Urutan</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-text">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-muted/50 transition-colors duration-100">
                  <td className="px-4 py-3 font-medium text-text">{service.title}</td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell font-mono text-xs">{service.slug}</td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">{service.sortOrder}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <PublishButton
                        currentStatus={service.status}
                        action={
                          service.status === "published"
                            ? unpublishService.bind(null, service.id)
                            : publishService.bind(null, service.id)
                        }
                      />
                      <Link
                        href={`/admin/layanan/${service.id}`}
                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteService.bind(null, service.id)}
                        confirmMessage={`Hapus layanan "${service.title}"?`}
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
