import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { requireAdmin } from "@/server/auth/guard";

export default async function AdminAkunPage() {
  await requireAdmin();

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Akun admin
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Ganti password saat sudah masuk. Tidak perlu verifikasi email — cukup
          password saat ini. Fitur lupa password via email belum ada.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
