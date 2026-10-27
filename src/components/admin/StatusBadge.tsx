interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-amber-100 text-amber-700",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Tayang",
  draft: "Draft",
  archived: "Arsip",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
  const label = STATUS_LABEL[status] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
