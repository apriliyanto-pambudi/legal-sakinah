/** Skeleton area konten saat pindah menu admin — sidebar tetap. */
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-border/80" />
        <div className="h-4 w-72 max-w-full rounded-md bg-border/60" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
        <div className="h-4 w-full rounded-md bg-border/70" />
        <div className="h-4 w-5/6 rounded-md bg-border/60" />
        <div className="h-4 w-2/3 rounded-md bg-border/50" />
        <div className="h-4 w-full rounded-md bg-border/60" />
        <div className="h-4 w-3/4 rounded-md bg-border/50" />
      </div>
      <span className="sr-only">Memuat halaman…</span>
    </div>
  );
}
