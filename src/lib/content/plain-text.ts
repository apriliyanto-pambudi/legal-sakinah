/**
 * Konten CMS untuk admin awam: tulis teks biasa, simpan sebagai HTML aman.
 *
 * Aturan tulis:
 *   baris kosong   → paragraf baru
 *   ## Subjudul    → subjudul
 *   - poin         → daftar poin
 *   > catatan      → catatan kecil (disclaimer)
 */

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&[a-z]+;|&#39;/gi, (e) => ENTITIES[e.toLowerCase()] ?? e)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

/** Isi tag → teks (entity belum di-decode); `<br>` jadi baris baru. */
function innerText(html: string): string {
  return html
    .replace(/\s+/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

export function plainTextToHtml(text: string): string {
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let note: string[] = [];

  const flush = () => {
    if (para.length) out.push(`<p>${para.join("<br>")}</p>`);
    if (list.length) out.push(`<ul>${list.map((i) => `<li>${i}</li>`).join("")}</ul>`);
    if (note.length) out.push(`<p class="disclaimer"><em>${note.join("<br>")}</em></p>`);
    para = [];
    list = [];
    note = [];
  };

  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      out.push(`<h3>${escapeHtml(line.slice(3).trim())}</h3>`);
      continue;
    }
    const item = line.match(/^[-•*]\s+(.*)$/);
    if (item) {
      if (para.length || note.length) flush();
      list.push(escapeHtml(item[1]));
      continue;
    }
    const n = line.match(/^>\s?(.*)$/);
    if (n) {
      if (para.length || list.length) flush();
      note.push(escapeHtml(n[1]));
      continue;
    }
    if (list.length || note.length) flush();
    para.push(escapeHtml(line));
  }
  flush();

  return out.join("\n");
}

/** Kebalikan `plainTextToHtml` — untuk mengisi form edit dari konten lama. */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html?.trim()) return "";

  const text = html
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, t) => `\n\n## ${innerText(t).replace(/\n/g, " ")}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${innerText(t).replace(/\n/g, " ")}`)
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n\n")
    .replace(/<p[^>]*class="disclaimer"[^>]*>([\s\S]*?)<\/p>/gi, (_, t) =>
      `\n\n${innerText(t).split("\n").map((l) => `> ${l}`).join("\n")}\n\n`
    )
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n\n${innerText(t)}\n\n`);

  return decodeEntities(text.replace(/<[^>]+>/g, ""))
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
