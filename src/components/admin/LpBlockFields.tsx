import PhotoUploadField from "@/components/admin/PhotoUploadField";
import {
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/form-styles";

type JsonRecord = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asLines(value: unknown): string {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").join("\n")
    : "";
}

function asPairs(value: unknown, left: string, right: string, sep: string): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const record = item as JsonRecord;
      return `${asString(record[left])}${sep}${asString(record[right])}`;
    })
    .filter(Boolean)
    .join("\n");
}

export default function LpBlockFields({
  blockType,
  content,
}: {
  blockType: string;
  content: unknown;
}) {
  const data = (content && typeof content === "object" ? content : {}) as JsonRecord;

  if (blockType === "hero") {
    // shortcut: badge/note UI hidden — banner & CTA di pengaturan halaman
    return (
      <p className="text-sm text-[var(--color-muted)]">
        Tidak ada field di blok ini. Banner dan teks CTA diatur di pengaturan halaman di atas.
      </p>
    );
  }

  if (blockType === "problem") {
    return (
      <>
        <Text name="eyebrow" label="Eyebrow" value={asString(data.eyebrow)} />
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Pengantar" name="intro">
          <textarea name="intro" rows={3} defaultValue={asString(data.intro)} className={`${adminInputClass} resize-y`} />
        </Field>
        <Field label="Butir masalah" name="items" hint="Satu baris per butir">
          <textarea name="items" rows={5} defaultValue={asLines(data.items)} className={`${adminInputClass} resize-y`} />
        </Field>
      </>
    );
  }

  if (blockType === "solution") {
    return (
      <>
        <Text name="eyebrow" label="Eyebrow" value={asString(data.eyebrow)} />
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Pengantar" name="intro">
          <textarea name="intro" rows={3} defaultValue={asString(data.intro)} className={`${adminInputClass} resize-y`} />
        </Field>
        <Field label="Item solusi" name="items" hint="Format: Judul | Deskripsi">
          <textarea
            name="items"
            rows={6}
            defaultValue={asPairs(data.items, "title", "description", " | ")}
            className={`${adminInputClass} resize-y`}
          />
        </Field>
      </>
    );
  }

  if (blockType === "process") {
    return (
      <>
        <Text name="eyebrow" label="Eyebrow" value={asString(data.eyebrow)} />
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Langkah" name="steps" hint="Format: Judul | Deskripsi">
          <textarea
            name="steps"
            rows={6}
            defaultValue={asPairs(data.steps, "title", "description", " | ")}
            className={`${adminInputClass} resize-y`}
          />
        </Field>
      </>
    );
  }

  if (blockType === "proof") {
    return (
      <>
        <Text name="eyebrow" label="Eyebrow" value={asString(data.eyebrow)} />
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Poin kredibilitas" name="points" hint="Satu baris per poin">
          <textarea name="points" rows={4} defaultValue={asLines(data.points)} className={`${adminInputClass} resize-y`} />
        </Field>
        <Field label="Testimoni" name="testimonials" hint="Format: Kutipan || Atribusi">
          <textarea
            name="testimonials"
            rows={4}
            defaultValue={asPairs(data.testimonials, "quote", "attribution", " || ")}
            className={`${adminInputClass} resize-y`}
          />
        </Field>
        <Field label="Catatan" name="note">
          <textarea name="note" rows={2} defaultValue={asString(data.note)} className={`${adminInputClass} resize-y`} />
        </Field>
      </>
    );
  }

  if (blockType === "faq") {
    return (
      <>
        <Text name="eyebrow" label="Eyebrow" value={asString(data.eyebrow)} />
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Pertanyaan" name="items" hint="Format: Pertanyaan || Jawaban">
          <textarea
            name="items"
            rows={8}
            defaultValue={asPairs(data.items, "question", "answer", " || ")}
            className={`${adminInputClass} resize-y`}
          />
        </Field>
      </>
    );
  }

  if (blockType === "cta") {
    return (
      <>
        <Text name="title" label="Judul" value={asString(data.title)} />
        <Field label="Deskripsi" name="description">
          <textarea name="description" rows={3} defaultValue={asString(data.description)} className={`${adminInputClass} resize-y`} />
        </Field>
        <Text name="ctaText" label="Teks tombol" value={asString(data.ctaText)} />
      </>
    );
  }

  if (blockType === "image_cards") {
    const existing = Array.isArray(data.cards)
      ? data.cards.filter(
          (item): item is JsonRecord => !!item && typeof item === "object"
        )
      : [];
    // Satu slot kosong di akhir untuk menambah foto.
    const slots: JsonRecord[] = [...existing, { imageUrl: "" }];

    return (
      <>
        <p className="text-xs text-text-muted -mt-1 mb-1">
          Mirip Prestige: unggah foto bertumpuk. Teks biasanya sudah di dalam gambar.
        </p>
        <input type="hidden" name="cardCount" value={slots.length} />
        <div className="space-y-4">
          {slots.map((card, i) => {
            const imageUrl = asString(card.imageUrl);
            const isBlank = !imageUrl;
            return (
              <div
                key={i}
                className="space-y-3 rounded-lg border border-border bg-muted/40 p-4"
              >
                <p className="text-sm font-medium text-primary">
                  {isBlank ? "Foto baru" : `Foto ${i + 1}`}
                </p>
                <PhotoUploadField
                  currentUrl={imageUrl || null}
                  label="Gambar"
                  fileInputName={`cardImage_${i}`}
                  hiddenName={`cardImageUrl_${i}`}
                  hint="JPEG, PNG, atau WebP · Maks 5 MB"
                  previewClassName="h-40 w-full max-w-sm"
                  alt={`Foto ${i + 1}`}
                />
                {isBlank ? (
                  <p className="text-xs text-text-muted">
                    Pilih gambar lalu Simpan blok untuk menambah foto.
                  </p>
                ) : (
                  <label className="flex items-center gap-2 text-sm text-red-600">
                    <input
                      type="checkbox"
                      name={`cardRemove_${i}`}
                      value="1"
                      className="rounded border-border"
                    />
                    Hapus foto ini
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <Field label="HTML kustom (khusus developer)" name="html">
      <textarea
        name="html"
        rows={8}
        defaultValue={asString(data.html)}
        className={`${adminInputClass} resize-y font-mono`}
      />
    </Field>
  );
}

function Field({
  label,
  name,
  hint,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={adminLabelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}

function Text({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  return (
    <Field label={label} name={name}>
      <input id={name} name={name} type="text" defaultValue={value} className={adminInputClass} />
    </Field>
  );
}
