interface AdminAlertProps {
  message?: string | null;
  variant?: "error" | "success";
}

export default function AdminAlert({
  message,
  variant = "error",
}: AdminAlertProps) {
  if (!message) return null;

  const decoded = decodeURIComponent(message);
  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`mb-5 rounded-lg border px-4 py-3 text-sm ${styles}`} role="status">
      {decoded}
    </div>
  );
}
