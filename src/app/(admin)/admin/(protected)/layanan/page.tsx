import Link from "next/link";
import { requireAdmin } from "@/server/auth/guard";
import { getAllServicesForAdmin } from "@/server/db/queries/services";
import ServiceList from "@/components/admin/ServiceList";
import {
  publishService,
  unpublishService,
  deleteService,
} from "@/server/actions/services";
import { Plus } from "lucide-react";

export default async function AdminLayananPage() {
  await requireAdmin();
  const services = await getAllServicesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">Layanan</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Seret baris untuk mengatur urutan. 3 layanan tayang teratas = kartu utama
            beranda; berikutnya di baris bawah &amp; /layanan.
          </p>
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
          <p className="text-text-muted text-sm">
            Belum ada layanan. Klik &quot;Tambah Layanan&quot; untuk memulai.
          </p>
        </div>
      ) : (
        <ServiceList
          services={services.map((service) => ({
            id: service.id,
            title: service.title,
            slug: service.slug,
            sortOrder: service.sortOrder,
            status: service.status,
            publishAction: publishService.bind(null, service.id),
            unpublishAction: unpublishService.bind(null, service.id),
            deleteAction: deleteService.bind(null, service.id),
          }))}
        />
      )}
    </div>
  );
}
