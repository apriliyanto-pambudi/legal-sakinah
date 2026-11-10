/** Self-check konversi teks ↔ HTML CMS.  Jalankan: pnpm exec tsx scripts/check-plain-text.ts */
import assert from "node:assert/strict";
import { htmlToPlainText, plainTextToHtml } from "../src/lib/content/plain-text";

const plain = [
  "Paragraf pertama.",
  "Baris kedua paragraf sama.",
  "",
  "## Yang kami bantu",
  "- Cerai gugat",
  "- Hak asuh <anak> & nafkah",
  "",
  "> Informasi bersifat umum.",
].join("\n");

const html = plainTextToHtml(plain);
assert.equal(
  html,
  [
    "<p>Paragraf pertama.<br>Baris kedua paragraf sama.</p>",
    "<h3>Yang kami bantu</h3>",
    "<ul><li>Cerai gugat</li><li>Hak asuh &lt;anak&gt; &amp; nafkah</li></ul>",
    '<p class="disclaimer"><em>Informasi bersifat umum.</em></p>',
  ].join("\n")
);

// round-trip stabil: edit tanpa perubahan tidak mengubah konten
const back = htmlToPlainText(html);
assert.ok(back.includes("- Hak asuh <anak> & nafkah"));
assert.equal(plainTextToHtml(back), html);

// konten lama dari seed (indentasi + entity)
const legacy = `
  <p>Biaya &ldquo;mulai dari&rdquo;.</p>
  <h3>Yang kami bantu</h3>
  <ul>
    <li>Cerai gugat</li>
  </ul>
  <p class="disclaimer"><em>Bukan nasihat hukum.</em></p>
`;
assert.equal(
  htmlToPlainText(legacy),
  "Biaya \u201Cmulai dari\u201D.\n\n## Yang kami bantu\n\n- Cerai gugat\n\n> Bukan nasihat hukum."
);

assert.equal(plainTextToHtml("   \n\n "), "");
assert.equal(htmlToPlainText(null), "");

console.log("plain-text OK");
