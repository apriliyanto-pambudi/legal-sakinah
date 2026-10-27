# Template Prompt Implementasi — Legal Sakinah

Gunakan **satu prompt per chat/tahap**. Jangan gabungkan beberapa tahap dalam satu pesan.

**Sumber kebenaran:**

- `PRD.md`
- `design-system/legal-sakinah/MASTER.md`
- Override halaman: `design-system/legal-sakinah/pages/`

**Dummy tetap:**

- WA: `6281234567890`
- Prefill: `Halo Legal Sakinah, saya ingin konsultasi hukum keluarga.`
- Domain production: nanti (`localhost` dulu)

---

## Agent AI per tahap (WAJIB DIBACA)

Sebelum copy-paste prompt, **ganti model di Cursor** sesuai kolom Agent AI.


| Tahap | Nama tahap            | Agent AI (pilih di Cursor)                             | Alasan singkat               |
| ----- | --------------------- | ------------------------------------------------------ | ---------------------------- |
| 1     | Scaffold project      | **Claude Sonnet 4.6**                                  | Setup cepat, struktur folder |
| 2     | Database + Auth       | **Claude Opus 5**                                      | Schema + better-auth kritis  |
| 3     | Website publik        | **Claude Sonnet 4.6**                                  | Banyak halaman UI            |
| 4     | LP ads + tracking CTA | **Claude Opus 5**                                      | Beacon, UTM, rate limit      |
| 5     | CMS admin             | **Claude Sonnet 4.6**                                  | CRUD UI + server actions     |
| 6     | Dashboard klik CTA    | **Claude Sonnet 4.6** *(naik Opus 5 jika query rumit)* | Aggregasi + chart            |
| 7     | Polish + hardening    | **Claude Sonnet 4.6**                                  | A11y & performa              |
| 8     | Deploy VPS            | **Claude Sonnet 4.6**                                  | Config Nginx/PM2 (nanti)     |


**Cara ganti di Cursor:** buka model picker di chat → pilih nama Agent AI di atas → baru paste prompt.

---



## Cara pakai

1. Lihat tabel **Agent AI per tahap**.
2. Ganti model di Cursor ke Agent AI tahap itu.
3. Copy blok prompt tahap tersebut.
4. Verifikasi checklist “Selesai jika”.
5. Chat baru untuk tahap berikutnya.

---



## Tahap 1 — Scaffold project

**Agent AI: Claude Sonnet 4.6**  
→ Di Cursor: pilih **Claude Sonnet 4.6** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Lanjut implementasi Legal Sakinah — TAHAP 1 SAJA (Scaffold).

Ikuti PRD.md Section 3 (stack + folder structure) dan design-system/legal-sakinah/MASTER.md.

Kerjakan HANYA:
1. Init Next.js (App Router) + TypeScript + Tailwind + pnpm
2. Struktur route groups: (marketing), (lp), (admin)
3. Buat src/styles/tokens.css dari MASTER.md (CSS variables) — jangan hardcode hex di komponen
4. Root layout: font EB Garamond + Lato via next/font
5. Layout kosong marketing (header/footer placeholder) dan lp (tanpa nav)
6. .env.example sesuai PRD (WA dummy 6281234567890, SITE_URL localhost)
7. README singkat: cara install & jalankan

JANGAN kerjakan: database, auth, CMS, tracking, halaman konten penuh, deploy.

Selesai jika: pnpm dev berjalan, token warna/font terlihat, struktur folder sesuai PRD.
```

**Checklist:**

- [ ] `pnpm dev` OK
- [ ] Token di `tokens.css`
- [ ] Folder `(marketing)` / `(lp)` / `(admin)` ada

---



## Tahap 2 — Database + Auth admin

**Agent AI: Claude Opus 5**  
→ Di Cursor: pilih **Claude Opus 5** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Opus 5]

Lanjut implementasi Legal Sakinah — TAHAP 2 SAJA (Database + Auth).

Ikuti PRD.md Section 3 & 5. Asumsi Tahap 1 sudah selesai.

Kerjakan HANYA:
1. Drizzle ORM + schema PostgreSQL sesuai PRD Section 5 (users/accounts/sessions, services, pages, faqs, team_members, landing_pages, landing_page_blocks, site_settings, cta_clicks, media_assets)
2. drizzle.config + migrasi awal
3. better-auth (email/password), role admin, cookie session
4. Route /admin/login + middleware guard /admin/**
5. Helper requireAdmin() untuk server actions
6. Script seed admin (email/password dari env)
7. Dokumentasikan cara jalankan Postgres lokal + migrate + seed di README

JANGAN kerjakan: CMS CRUD UI, website konten, LP ads, dashboard, tracking CTA endpoint (boleh siapkan tabel cta_clicks saja).

Selesai jika: migrate jalan, seed admin berhasil, login ke /admin, route admin terproteksi.
```

**Checklist:**

- [ ] Migrasi sukses
- [ ] Login admin OK
- [ ] `/admin` tanpa session → redirect login

---



## Tahap 3 — Website publik (konten dummy)

**Agent AI: Claude Sonnet 4.6**  
→ Di Cursor: pilih **Claude Sonnet 4.6** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Lanjut implementasi Legal Sakinah — TAHAP 3 SAJA (Website publik).

Ikuti PRD.md Section 4A + 6, dan design-system/legal-sakinah/pages/website-utama.md.

Kerjakan HANYA:
1. Halaman: Beranda, Tentang, Layanan (list + detail slug), Tim, FAQ, Kontak, Kebijakan Privasi
2. Header + footer penuh + skip-to-content
3. Komponen shared WhatsApp CTA (pakai nomor & prefill dummy dari env/settings)
4. Konten dummy realistis Bahasa Indonesia (tanpa harga, tanpa jaminan hasil hukum)
5. SEO dasar: metadata per halaman, sitemap.ts (tanpa LP), robots.ts
6. Mobile-first, pakai design tokens (bukan hex hardcoded)

Boleh hardcode/seed konten sementara jika CMS belum siap — siapkan struktur agar mudah diganti CMS di Tahap 5.

JANGAN kerjakan: LP ads, admin CMS, dashboard, API event CTA, deploy.

Selesai jika: navigasi lengkap, CTA buka wa.me dengan dummy number, tampilan mengikuti design system.
```

**Checklist:**

- [ ] Semua halaman marketing accessible
- [ ] CTA WA berfungsi
- [ ] Tidak ada harga / klaim “pasti menang”

---



## Tahap 4 — Landing page ads + tracking CTA

**Agent AI: Claude Opus 5**  
→ Di Cursor: pilih **Claude Opus 5** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Opus 5]

Lanjut implementasi Legal Sakinah — TAHAP 4 SAJA (LP ads + event CTA).

Ikuti PRD.md Section 4B + Alur klik CTA (wajib) + Section 5.4 + 6.4, dan design-system/legal-sakinah/pages/landing-page-ads.md.

Kerjakan HANYA:
1. Satu LP contoh: /promo-hak-asuh (layout tanpa header/footer/nav)
2. Sticky CTA WhatsApp di mobile + beberapa CTA dengan cta_label unik
3. noindex/nofollow + exclude dari sitemap
4. Baca & persist UTM di sessionStorage (server tidak mengubah nilai UTM)
5. POST /api/events/cta — validasi Zod, rate limit sederhana, simpan ke cta_clicks
6. Client: sendBeacon (fallback fetch keepalive) — JANGAN await sebelum buka WhatsApp
7. Komponen WhatsApp CTA di website utama juga ikut alur yang sama
8. GA4 stub (measurement ID dari env; boleh kosong/disabled jika belum ada)

JANGAN kerjakan: CMS editor LP, dashboard admin, deploy.

Selesai jika: klik CTA tersimpan di DB, WhatsApp tetap terbuka cepat, kegagalan API tidak memblokir WA.
```

**Checklist:**

- [ ] LP tanpa navigasi
- [ ] Event masuk tabel `cta_clicks`
- [ ] UTM tersimpan apa adanya
- [ ] Tidak ada `await` yang menunda buka WA

---



## Tahap 5 — CMS admin

**Agent AI: Claude Sonnet 4.6**  
→ Di Cursor: pilih **Claude Sonnet 4.6** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Lanjut implementasi Legal Sakinah — TAHAP 5 SAJA (CMS admin).

Ikuti PRD.md Section 4C.2.

Kerjakan HANYA:
1. Shell admin (sidebar) setelah login
2. CRUD: layanan, FAQ, tim, halaman statis, landing pages (+ blocks)
3. Status draft/published + soft delete
4. Site settings: nomor WA, prefill default
5. Server Actions + requireAdmin() di setiap mutasi
6. revalidatePath/revalidateTag saat publish agar publik update tanpa redeploy
7. UI admin boleh shadcn/ui; tetap rapi dan usable

JANGAN kerjakan: dashboard analytics klik CTA (itu Tahap 6), deploy.

Selesai jika: admin bisa ubah konten/LP → tampil di publik setelah publish.
```

**Checklist:**

- [ ] CRUD entity inti jalan
- [ ] Draft tidak tampil publik
- [ ] Publish memicu revalidate

---



## Tahap 6 — Dashboard klik CTA

**Agent AI: Claude Sonnet 4.6**  
→ Default: **Claude Sonnet 4.6**. Jika agregasi/filter UTM macet atau salah → naik ke **Claude Opus 5**.

```
[Agent AI yang dipakai: Claude Sonnet 4.6 — naikkan ke Opus 5 jika query/filter rumit]

Lanjut implementasi Legal Sakinah — TAHAP 6 SAJA (Dashboard klik CTA).

Ikuti PRD.md Section 4C.3. Sumber kebenaran = database cta_clicks (bukan GA4).

Kerjakan HANYA:
1. Halaman /admin/dashboard
2. Filter rentang tanggal (preset + custom), timezone Asia/Jakarta
3. Stat cards: total klik, LP vs website
4. Tren klik per hari
5. Tabel klik per LP/halaman
6. Breakdown UTM (source/medium/campaign)
7. Breakdown cta_label
8. Catatan UI wajib: klik = intent, BUKAN konversi closing
9. (Opsional) ekspor CSV sesuai filter

JANGAN kerjakan: WhatsApp AI, manajemen iklan, deploy production.

Selesai jika: angka dashboard cocok dengan data di cta_clicks untuk filter yang sama.
```

**Checklist:**

- [ ] Filter tanggal berfungsi
- [ ] Breakdown UTM & LP terlihat
- [ ] Disclaimer intent tampil di UI

---



## Tahap 7 — Polish + hardening

**Agent AI: Claude Sonnet 4.6**  
→ Di Cursor: pilih **Claude Sonnet 4.6** dulu, baru paste.

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Lanjut implementasi Legal Sakinah — TAHAP 7 SAJA (Polish + hardening).

Ikuti PRD.md Section 6 (constraints).

Kerjakan HANYA:
1. Perbaiki a11y dasar (focus, kontras, label, skip link)
2. Performa LP (image, font, bundle) — target mobile-first
3. Review rate limit & validasi endpoint CTA
4. Pastikan LP noindex; sitemap tidak memuat LP
5. Hormati prefers-reduced-motion
6. Rapikan copy disclaimer di layanan/LP
7. Checklist singkat di README: verifikasi sebelum go-live (ganti WA dummy, domain, GA4)

JANGAN kerjakan: deploy VPS penuh kecuali diminta terpisah.

Selesai jika: Beranda + 1 LP terasa solid di mobile, tidak ada regresi fitur Tahap 1–6.
```

**Checklist:**

- [ ] Keyboard navigation OK
- [ ] Sticky CTA tidak menutupi konten penting
- [ ] README go-live checklist ada

---



## Tahap 8 — Deploy VPS (nanti, setelah domain)

**Agent AI: Claude Sonnet 4.6**  
→ Di Cursor: pilih **Claude Sonnet 4.6** dulu, baru paste.  
→ Naik **Claude Opus 5** hanya jika setup server/Nginx rumit.

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Lanjut implementasi Legal Sakinah — TAHAP 8 SAJA (Deploy VPS).

Ikuti PRD.md Section 3.5.

Kerjakan HANYA:
1. Contoh konfigurasi Nginx + PM2 (deploy/)
2. Langkah SSL Let's Encrypt (dokumentasi)
3. Env production checklist
4. Script/prosedur: migrate, build, pm2 reload
5. Pastikan HTTP→HTTPS, security headers dasar

Asumsikan domain & VPS credentials akan diisi user. Jangan hardcode secret.

Selesai jika: dokumen + config contoh siap dipakai saat domain sudah ada.
```

**Checklist:**

- [ ] `deploy/nginx.conf.example` ada
- [ ] `deploy/ecosystem.config.cjs` ada
- [ ] Langkah deploy tertulis di README

---



## Prompt tambahan (opsional)



### Ganti nomor WA resmi (sebelum go-live)

**Agent AI: Claude Sonnet 4.6**

```
[Agent AI yang dipakai: Claude Sonnet 4.6]

Ganti semua WhatsApp dummy 6281234567890 ke nomor resmi: [ISI_NOMOR].
Update .env.example catatan, seed/settings default, dan README go-live checklist.
Jangan ubah fitur lain.
```



### Revisi arah desain (pakai UI UX Pro Max lagi)

**Agent AI: Claude Sonnet 4.6** (+ skill UI UX Pro Max)

```
[Agent AI yang dipakai: Claude Sonnet 4.6 + skill UI UX Pro Max]

Pakai skill UI UX Pro Max. Revisi design system Legal Sakinah:
[tulis perubahan: mis. lebih hijau, font lebih modern, dll.]
Update design-system/legal-sakinah/MASTER.md dan tokens.css saja.
Jangan redesign seluruh halaman dulu kecuali diminta.
```

---



## Urutan eksekusi cepat

```
Chat 1 → Agent AI: Claude Sonnet 4.6  → paste Tahap 1
Chat 2 → Agent AI: Claude Opus 5      → paste Tahap 2
Chat 3 → Agent AI: Claude Sonnet 4.6  → paste Tahap 3
Chat 4 → Agent AI: Claude Opus 5      → paste Tahap 4
Chat 5 → Agent AI: Claude Sonnet 4.6  → paste Tahap 5
Chat 6 → Agent AI: Claude Sonnet 4.6  → paste Tahap 6
Chat 7 → Agent AI: Claude Sonnet 4.6  → paste Tahap 7
Chat 8 → Agent AI: Claude Sonnet 4.6  → paste Tahap 8 (nanti)
```

