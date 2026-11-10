import { adminInputClass, adminLabelClass } from "@/components/admin/form-styles";
import { htmlToPlainText } from "@/lib/content/plain-text";

const tips = [
  { code: "Baris kosong", desc: "paragraf baru" },
  { code: "## Subjudul", desc: "judul kecil di dalam isi" },
  { code: "- Poin", desc: "daftar poin" },
  { code: "> Catatan", desc: "catatan kecil (mis. disclaimer)" },
];

export default function ContentTextField({
  defaultHtml,
  rows = 14,
  placeholder,
  hint,
}: {
  defaultHtml?: string | null;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor="content" className={adminLabelClass}>
        Isi konten
      </label>
      <textarea
        id="content"
        name="content"
        rows={rows}
        defaultValue={htmlToPlainText(defaultHtml)}
        placeholder={placeholder}
        aria-describedby="content-tips"
        className={`${adminInputClass} resize-y leading-relaxed`}
      />
      <div id="content-tips" className="mt-2 rounded-md bg-muted px-3 py-2.5 text-xs text-text-muted">
        <p className="mb-1.5">Tulis seperti biasa, tidak perlu kode. Format sederhana:</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {tips.map((t) => (
            <li key={t.code}>
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-text">{t.code}</code>{" "}
              → {t.desc}
            </li>
          ))}
        </ul>
        {hint ? <p className="mt-2">{hint}</p> : null}
      </div>
    </div>
  );
}
