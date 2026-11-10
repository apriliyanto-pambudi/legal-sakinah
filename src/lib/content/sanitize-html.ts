import sanitizeHtml from "sanitize-html";

/** HTML dari TipTap → aman disimpan & dirender di publik. */
export function sanitizeCmsHtml(html: string | null | undefined): string | null {
  const raw = html?.trim() ?? "";
  if (!raw) return null;

  const cleaned = sanitizeHtml(raw, {
    allowedTags: [
      "p",
      "br",
      "h3",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "blockquote",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      p: ["class"],
    },
    allowedClasses: {
      p: ["disclaimer"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  }).trim();

  return cleaned || null;
}
