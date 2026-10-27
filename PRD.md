# PRD — Website Legal Sakinah (Firma Hukum Keluarga + Landing Page Ads + CMS)

> Status dokumen: Draft v1 (untuk implementasi di Cursor)
> Pemilik produk: [TBD]
> Terakhir diperbarui: [TBD]

---

## 1. Overview

**Legal Sakinah** adalah brand firma hukum yang berfokus pada **jasa konsultasi hukum dan pendampingan persidangan di bidang hukum keluarga** (contoh area praktik: perceraian, hak asuh anak, nafkah, harta bersama, isbat nikah, waris keluarga — daftar final area praktik [TBD] dari klien).

### 1.1 Masalah yang diselesaikan

Saat ini brand belum memiliki kanal digital yang bisa dipakai untuk dua kebutuhan berbeda sekaligus:

1. **Kredibilitas & kepercayaan.** Calon klien hukum keluarga berada dalam kondisi emosional dan sensitif. Mereka mencari kepastian bahwa firma yang dihubungi kredibel, profesional, dan berpengalaman. Tanpa website utama yang rapi, brand kalah dibanding kompetitor yang sudah punya profil online.
2. **Akuisisi berbayar yang terukur.** Traffic dari iklan (Google/Meta Ads) membutuhkan halaman pendaratan (landing page) fokus-konversi tanpa distraksi navigasi. Tanpa LP khusus dan tanpa pencatatan klik CTA, tim tidak bisa mengetahui LP mana, kampanye mana, dan pesan mana yang benar-benar menghasilkan intent (klik WhatsApp).

Selain itu, saat ini tidak ada mekanisme bagi tim internal untuk memperbarui konten (layanan, FAQ, profil tim, isi LP) tanpa bantuan developer, dan tidak ada satu pun sumber data internal yang bisa dipercaya untuk mengukur performa klik CTA.

### 1.2 Tujuan utama website

| # | Tujuan | Indikator keberhasilan (v1) |
|---|---|---|
| G1 | Membangun kepercayaan terhadap brand Legal Sakinah | Website utama live dengan halaman layanan, profil/tim, FAQ, dan kontak |
| G2 | Menghasilkan intent konsultasi via WhatsApp | Jumlah klik CTA WhatsApp tercatat di database |
| G3 | Mengukur performa iklan sampai level LP & UTM | Dashboard admin menampilkan klik per LP dan breakdown UTM |
| G4 | Kemandirian tim konten | Admin dapat menambah/mengubah konten dasar & LP tanpa deploy ulang |
| G5 | Fondasi teknis yang bisa dikembangkan | Struktur data & kode siap untuk fase berikutnya (mis. otomasi) |

### 1.3 Cakupan sistem

Sistem yang dibangun terdiri dari empat bagian dalam **satu aplikasi, satu domain**:

1. **Website publik utama** — profil firma, layanan, FAQ, artikel/edukasi (opsional v1), kontak. Memiliki navigasi (header + footer) penuh.
2. **Landing page ads** — halaman kampanye di subdirectory (contoh: `/promo-hak-asuh`), **tanpa header/footer/navigasi**, fokus tunggal pada CTA WhatsApp, menerima parameter UTM.
3. **CMS admin** — area terproteksi login untuk mengelola konten dasar dan landing page.
4. **Dashboard performa klik CTA** — laporan internal jumlah klik CTA (terutama dari LP ads), dengan filter tanggal dan breakdown UTM. **Sumber kebenaran = database internal**, bukan GA4.

### 1.4 In scope / Out of scope (v1)

**IN SCOPE v1**
- Website publik utama + landing page ads (subdirectory)
- Database (PostgreSQL) sebagai penyimpanan konten & event
- CMS admin (auth + CRUD konten dasar + CRUD landing page)
- Pencatatan event klik CTA ke database + dashboard klik CTA
- Tracking publik: GA4 + UTM (Meta Pixel opsional)
- Deploy production: VPS + domain + SSL

**OUT OF SCOPE v1**
- WhatsApp AI / chatbot / RAG / auto-reply
- Manajemen & optimasi iklan harian (bidding, budget, creative rotation)
- Automasi closing deal, CRM pipeline, penjadwalan konsultasi otomatis
- Pembayaran online / invoicing
- Multi-bahasa (i18n)
- Multi-role kompleks (v1 hanya role Admin)

### 1.5 Referensi visual & fungsional

| Referensi | Dipakai sebagai acuan untuk |
|---|---|
| `https://prestigeaqiqahjakarta.com/prestige-promo-500rb` | Pola **LP ads**: satu halaman panjang, tanpa navigasi, CTA WhatsApp berulang, struktur persuasif |
| `https://www.legalkeluarga.id/` | Pola **website utama**: struktur informasi firma hukum keluarga, halaman layanan, tone profesional |

> Catatan: referensi dipakai untuk **pola struktur & fungsi**, bukan untuk menyalin desain, teks, atau aset. Arah visual final ditentukan lewat **UI UX Pro Max** (lihat Section 6).

---

## 2. Requirements

Persyaratan tingkat tinggi (high-level requirements) untuk v1:

### 2.1 Pengguna & akses

- Sistem melayani **dua kelompok pengguna**: (a) **pengunjung publik** (anonim, tanpa login) dan (b) **admin internal** (wajib login).
- Tidak ada registrasi mandiri untuk publik. Akun admin dibuat lewat proses seeding/undangan internal.
- Role minimal v1: **Admin** (akses penuh CMS + dashboard). Role tambahan (Editor, Viewer) [TBD] untuk fase berikutnya.
- Semua halaman publik dapat diakses tanpa autentikasi; seluruh route `/admin/**` dan API admin wajib terproteksi.

### 2.2 Konten & CMS

- Admin dapat melakukan CRUD terhadap: layanan, FAQ, profil/tim, halaman statis, dan landing page (termasuk blok konten LP).
- Setiap entity konten memiliki status `draft` / `published` sehingga perubahan tidak langsung tayang.
- Perubahan konten yang dipublikasikan harus tampil di sisi publik **tanpa perlu re-deploy** (mekanisme revalidate/cache invalidation).
- Editor teks kaya (rich text) minimal mendukung heading, paragraf, list, bold/italic, link. Pilihan editor [TBD].
- Upload gambar (foto tim, logo, hero LP) dengan batas ukuran & tipe file yang divalidasi.

### 2.3 Keamanan & autentikasi

- Autentikasi admin berbasis session dengan cookie `httpOnly`, `secure`, `sameSite=lax`.
- Password disimpan sebagai hash (algoritma bawaan library auth; tidak boleh plaintext).
- Proteksi rute admin di level middleware **dan** di level server action/route handler (jangan hanya mengandalkan middleware).
- Rate limit pada endpoint login (anti brute-force) dan endpoint event CTA (anti-spam).
- Proteksi CSRF untuk mutasi di area admin.
- Validasi & sanitasi seluruh input (server-side), termasuk sanitasi HTML dari rich text sebelum dirender.
- Semua traffic wajib HTTPS (HTTP redirect ke HTTPS).
- Secrets (DB URL, auth secret, API keys) hanya lewat environment variable, tidak pernah di-commit.
- Kepatuhan privasi: **tidak menyimpan isi percakapan WhatsApp**, tidak menyimpan data pribadi calon klien di event tracking. Halaman Kebijakan Privasi wajib ada.

### 2.4 SEO

- Website utama: meta title/description per halaman, Open Graph & Twitter card, canonical URL, heading hierarchy yang benar, `sitemap.xml`, `robots.txt`.
- Structured data (JSON-LD): `LegalService` / `Organization` untuk brand, `FAQPage` untuk halaman FAQ, `BreadcrumbList` untuk halaman dalam.
- URL bersih dan deskriptif (contoh `/layanan/hak-asuh-anak`).
- **Landing page ads wajib `noindex, nofollow`** dan dikecualikan dari `sitemap.xml`.
- Gambar memakai `next/image` dengan `alt` yang bermakna.
- Target Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms pada koneksi 4G mobile.

### 2.5 Aksesibilitas

- Target kepatuhan: **WCAG 2.1 level AA (dasar)**.
- Kontras teks minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar.
- Semua elemen interaktif dapat dioperasikan dengan keyboard dan memiliki focus state yang terlihat.
- Tombol CTA WhatsApp memakai elemen semantik (`<a>` atau `<button>`) dengan accessible name yang jelas, bukan `<div>` yang di-klik.
- Form memiliki `<label>` terkait, pesan error yang terbaca screen reader.
- Struktur landmark (`header`, `main`, `footer`, `nav`) dan skip-to-content link pada website utama.
- Ukuran target sentuh minimal 44×44 px pada mobile.

### 2.6 Tracking & analytics

- **Tracking publik**: GA4 terpasang di seluruh halaman publik (website utama + LP). Meta Pixel opsional, dikontrol lewat environment variable / setting.
- **UTM**: parameter `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` dibaca dari URL, dipertahankan selama sesi (mis. sessionStorage), dan dikirim bersama event CTA. Server **tidak boleh** mengubah/menormalisasi nilai UTM selain trimming dan pembatasan panjang.
- **Pencatatan event CTA ke database**: setiap klik CTA WhatsApp dikirim ke backend dan disimpan sebagai baris event. Ini adalah **sumber kebenaran** untuk dashboard internal.
- Event GA4 boleh dikirim paralel sebagai cadangan/cross-check, tetapi angka di dashboard admin diambil dari database.
- Pencatatan event **tidak boleh** menunda pembukaan WhatsApp secara signifikan (lihat Section 6).
- Dashboard menampilkan minimal: total klik, klik per LP/halaman, tren per tanggal, dan breakdown UTM (source/medium/campaign).

### 2.7 Non-fungsional

- **Mobile-first**: mayoritas traffic iklan berasal dari mobile.
- Uptime target: [TBD] (indikatif 99.5%).
- Backup database terjadwal (harian) dengan retensi [TBD].
- Logging error server (tanpa data sensitif) dan health check endpoint.
- Kode berbahasa Inggris (variabel/fungsi), copy antarmuka berbahasa Indonesia.

---

## 3. Technology Stack & Folder Structure (AI Context)

Bagian ini adalah **konteks tetap untuk AI coding di Cursor**. Semua pilihan sudah difinalkan (satu opsi per kategori) agar implementasi konsisten.

### 3.1 Technology stack (final)

| Kategori | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js 15 (App Router), React 19, TypeScript** | Server Components sebagai default; `"use client"` hanya untuk komponen interaktif |
| Styling | **Tailwind CSS v4** | Design token diletakkan sebagai CSS variables + konfigurasi theme |
| Komponen UI | **shadcn/ui** (Radix UI primitives) | Dipakai terutama di area admin; komponen publik boleh custom mengikuti arah UI UX Pro Max |
| Database | **PostgreSQL 16** | Satu instance di VPS (atau managed DB, [TBD]) |
| ORM | **Drizzle ORM + drizzle-kit** | Schema-first, migrasi versioned di `drizzle/` |
| Auth admin | **better-auth** | Email + password, session berbasis cookie, adapter Drizzle. Role minimal: `admin` |
| Validasi | **Zod** | Dipakai di server action, route handler, dan form |
| Form | **React Hook Form + Zod resolver** | Untuk form CMS |
| Rich text | [TBD] (kandidat: Tiptap) | Output disimpan sebagai HTML tersanitasi atau JSON, keputusan [TBD] |
| Rate limit | In-memory/Postgres-based sederhana | v1 tanpa Redis; jika perlu skala, ganti ke Redis [TBD] |
| Analytics publik | **GA4** (`@next/third-parties/google`), **Meta Pixel opsional** | Dikontrol via env var |
| Charting dashboard | **Recharts** | Grafik tren klik & breakdown UTM |
| Hosting | **VPS (Ubuntu LTS)** | Node.js LTS, **PM2** sebagai process manager, **Nginx** sebagai reverse proxy |
| Domain & SSL | Domain production **[TBD nanti]** (`.id` preferred). Development: `localhost` | SSL via Let's Encrypt (Certbot) saat domain sudah ada |
| CI/CD | GitHub Actions → deploy ke VPS (SSH) | Detail pipeline [TBD] |
| Runtime tooling | pnpm, ESLint, Prettier | — |

**AI tooling yang dipakai selama pembangunan:**

- **Context7 (MCP)** — sumber dokumentasi library terbaru (Next.js, Drizzle, better-auth, Tailwind). **Aturan: sebelum menulis kode yang menyentuh API library, konsultasikan dokumentasi via Context7 alih-alih mengandalkan ingatan model.**
- **UI UX Pro Max** — dipakai untuk menghasilkan **arah desain awal** (moodboard, hierarki visual, komponen, tipografi, palet). Desain **belum final dari klien**, sehingga implementasi harus memakai design token terpusat agar penggantian tema murah (lihat Section 6).

### 3.2 Konvensi arsitektur

- **Rendering**: halaman publik memakai Static/ISR (`revalidate`) dan di-invalidate lewat `revalidateTag`/`revalidatePath` saat admin mem-publish konten. Area admin memakai rendering dinamis.
- **Mutasi**: gunakan **Server Actions** untuk semua mutasi CMS. Gunakan **Route Handler** (`/api/events/cta`) khusus untuk event CTA karena dipanggil dengan `navigator.sendBeacon`.
- **Akses data**: seluruh query DB berada di `src/server/db/queries/` atau `src/server/services/`. Komponen tidak memanggil Drizzle secara langsung.
- **Otorisasi**: setiap server action & route admin memanggil helper `requireAdmin()` di baris pertama.
- **Route group**: `(marketing)` untuk website utama (punya nav), `(lp)` untuk landing page (tanpa nav), `(admin)` untuk CMS.

### 3.3 Folder structure

```
legal-sakinah/
├─ drizzle/                          # Migrasi SQL hasil drizzle-kit
│  └─ meta/
├─ public/
│  ├─ images/
│  ├─ favicon.ico
│  └─ robots.txt                     # atau generated via app/robots.ts
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/                # WEBSITE UTAMA — dengan header & footer
│  │  │  ├─ layout.tsx               # Header + Footer + skip link
│  │  │  ├─ page.tsx                 # Beranda
│  │  │  ├─ tentang/page.tsx
│  │  │  ├─ layanan/
│  │  │  │  ├─ page.tsx              # Daftar layanan
│  │  │  │  └─ [slug]/page.tsx       # Detail layanan
│  │  │  ├─ tim/page.tsx
│  │  │  ├─ faq/page.tsx
│  │  │  ├─ artikel/                 # Opsional v1 [TBD]
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ kontak/page.tsx
│  │  │  └─ kebijakan-privasi/page.tsx
│  │  │
│  │  ├─ (lp)/                       # LANDING PAGE ADS — TANPA header/footer
│  │  │  ├─ layout.tsx               # Layout minimal, noindex, sticky CTA
│  │  │  └─ [lpSlug]/page.tsx        # contoh: /promo-hak-asuh
│  │  │
│  │  ├─ (admin)/
│  │  │  └─ admin/
│  │  │     ├─ layout.tsx            # Shell admin (sidebar) + guard
│  │  │     ├─ login/page.tsx
│  │  │     ├─ page.tsx              # Ringkasan
│  │  │     ├─ dashboard/page.tsx    # Dashboard klik CTA
│  │  │     ├─ layanan/
│  │  │     │  ├─ page.tsx
│  │  │     │  └─ [id]/page.tsx
│  │  │     ├─ faq/page.tsx
│  │  │     ├─ tim/page.tsx
│  │  │     ├─ halaman/page.tsx      # Halaman statis
│  │  │     ├─ landing-pages/
│  │  │     │  ├─ page.tsx
│  │  │     │  └─ [id]/page.tsx      # Editor LP + blok konten
│  │  │     └─ pengaturan/page.tsx   # Nomor WA, GA4 ID, Pixel ID, dll.
│  │  │
│  │  ├─ api/
│  │  │  ├─ auth/[...all]/route.ts   # Handler better-auth
│  │  │  ├─ events/cta/route.ts      # POST event klik CTA (sendBeacon target)
│  │  │  └─ health/route.ts
│  │  │
│  │  ├─ sitemap.ts                  # Mengecualikan LP ads
│  │  ├─ robots.ts
│  │  ├─ layout.tsx                  # Root layout: font, GA4, Pixel
│  │  └─ globals.css                 # Tailwind + design tokens
│  │
│  ├─ components/
│  │  ├─ ui/                         # shadcn/ui
│  │  ├─ marketing/                  # Header, Footer, Hero, ServiceCard, FaqAccordion
│  │  ├─ lp/                         # LpHero, LpProof, LpFaq, LpStickyCta
│  │  ├─ admin/                      # DataTable, StatCard, DateRangePicker, charts
│  │  └─ shared/
│  │     └─ whatsapp-cta.tsx         # Komponen CTA tunggal (wajib dipakai semua CTA)
│  │
│  ├─ server/
│  │  ├─ db/
│  │  │  ├─ index.ts                 # Koneksi Drizzle
│  │  │  ├─ schema.ts                # Definisi tabel (lihat Section 5)
│  │  │  └─ queries/
│  │  │     ├─ services.ts
│  │  │     ├─ landing-pages.ts
│  │  │     ├─ faqs.ts
│  │  │     ├─ team.ts
│  │  │     └─ analytics.ts          # Agregasi dashboard
│  │  ├─ actions/                    # Server Actions (CMS)
│  │  │  ├─ services.ts
│  │  │  ├─ landing-pages.ts
│  │  │  └─ settings.ts
│  │  ├─ auth/
│  │  │  ├─ auth.ts                  # Konfigurasi better-auth
│  │  │  └─ guard.ts                 # requireAdmin()
│  │  └─ services/
│  │     ├─ cta-events.ts            # Validasi + insert event
│  │     └─ rate-limit.ts
│  │
│  ├─ lib/
│  │  ├─ utm.ts                      # Baca & persist UTM
│  │  ├─ whatsapp.ts                 # Bangun URL wa.me + prefill
│  │  ├─ analytics.ts                # Wrapper GA4 / Pixel
│  │  ├─ validations/                # Skema Zod bersama
│  │  ├─ seo.ts                      # Helper metadata & JSON-LD
│  │  └─ utils.ts
│  │
│  ├─ styles/
│  │  └─ tokens.css                  # Token warna/tipografi (hasil UI UX Pro Max)
│  │
│  ├─ types/
│  └─ middleware.ts                  # Guard /admin/**
│
├─ scripts/
│  └─ seed-admin.ts                  # Membuat akun admin awal
├─ deploy/
│  ├─ nginx.conf.example
│  └─ ecosystem.config.cjs           # Konfigurasi PM2
├─ .env.example
├─ drizzle.config.ts
├─ next.config.ts
├─ tailwind.config.ts
├─ package.json
└─ README.md
```

### 3.4 Environment variables (`.env.example`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/legal_sakinah
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://legalsakinah.id

NEXT_PUBLIC_SITE_URL=http://localhost:3000       # Domain production [TBD] nanti; lokal pakai localhost
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890        # DUMMY development — ganti nomor resmi sebelum go-live
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX      # [TBD]
NEXT_PUBLIC_META_PIXEL_ID=                       # opsional, kosongkan untuk menonaktifkan

UPLOAD_DIR=/var/www/legal-sakinah/uploads        # [TBD] lokal vs object storage
CTA_EVENT_RATE_LIMIT_PER_MINUTE=20
NODE_ENV=production
```

### 3.5 Pola production (VPS)

- **Nginx** sebagai reverse proxy ke `127.0.0.1:3000`, menangani TLS (Let's Encrypt), gzip/brotli, security headers (HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options), dan cache header untuk aset statis `/_next/static`.
- **PM2** menjalankan `next start` dalam mode cluster (jumlah instance [TBD] sesuai vCPU), dengan `pm2 startup` + `pm2 save` agar auto-restart saat reboot.
- **PostgreSQL** hanya listen di localhost; backup harian via `pg_dump` + cron, retensi [TBD].
- Deployment: `git pull` → `pnpm install --frozen-lockfile` → `pnpm drizzle-kit migrate` → `pnpm build` → `pm2 reload`.
- Nginx wajib meneruskan `X-Forwarded-For` dan `X-Forwarded-Proto` agar IP asli & protokol terbaca aplikasi.

---

## 4. Core Features & User Flow

### A. Alur Publik — Website Utama

**Karakteristik:** memiliki header (navigasi) dan footer, dapat diindeks mesin pencari, fokus pada kredibilitas dan edukasi.

**Struktur navigasi (v1):** Beranda · Tentang · Layanan · Tim · FAQ · Artikel (opsional) · Kontak · tombol CTA "Konsultasi via WhatsApp".

**Alur utama:**

1. Pengunjung tiba dari organic search / direct / link sosial ke salah satu halaman website utama.
2. Halaman dimuat sebagai halaman statis/ISR; GA4 mencatat `page_view`; parameter UTM (jika ada) disimpan di sessionStorage.
3. Pengunjung menelusuri: Beranda → Layanan (daftar) → Detail layanan → FAQ.
4. Setiap halaman menampilkan CTA WhatsApp (di hero, di akhir konten, dan di header).
5. Saat CTA diklik, berjalan **Alur klik CTA** (lihat A.4 di bawah).
6. Pengunjung diarahkan ke WhatsApp dengan pesan prefill sesuai konteks halaman.

**Halaman & isi minimum:**

| Halaman | Isi minimum |
|---|---|
| Beranda | Hero + value proposition, ringkasan layanan, alasan memilih Legal Sakinah, bukti sosial (testimoni/statistik) [TBD], FAQ singkat, CTA |
| Tentang | Profil firma, nilai, area praktik, legalitas/keanggotaan organisasi [TBD] |
| Layanan (index) | Daftar layanan hukum keluarga dengan ringkasan & link detail |
| Layanan (detail) | Deskripsi layanan, tahapan proses, dokumen yang biasanya dibutuhkan, FAQ terkait, CTA |
| Tim | Daftar advokat/konsultan: foto, nama, jabatan, ringkas keahlian |
| FAQ | Pertanyaan umum dikelompokkan per kategori; markup JSON-LD `FAQPage` |
| Artikel | Opsional v1 [TBD]. Jika ada: daftar + detail artikel edukasi |
| Kontak | Alamat kantor, jam operasional, tombol WhatsApp, peta (embed opsional), form kontak [TBD] |
| Kebijakan Privasi | Penjelasan data yang dikumpulkan (cookies, analytics) dan yang tidak dikumpulkan |

**Persyaratan konten:** seluruh copy bersifat informatif dan tidak memberikan opini/janji hasil hukum. Klaim seperti "pasti menang" dilarang. Disclaimer wajib pada halaman layanan: konsultasi lanjutan diperlukan untuk penilaian kasus spesifik. Teks final [TBD] dari klien.

---

### B. Alur Publik — Landing Page Ads (tanpa navigasi)

**Karakteristik:** URL subdirectory (contoh `/promo-hak-asuh`, `/konsultasi-perceraian`), **tanpa header, tanpa footer navigasi, tanpa link keluar** selain CTA WhatsApp dan link kebijakan privasi kecil di bagian bawah. Selalu `noindex, nofollow`. Dikecualikan dari `sitemap.xml`.

**Alur utama:**

1. User mengeklik iklan (Google Ads / Meta Ads) yang mengarah ke `https://legalsakinah.id/promo-hak-asuh?utm_source=google&utm_medium=cpc&utm_campaign=hak-asuh-jkt&utm_content=var-a`.
2. Server merender LP berdasarkan `lpSlug`; jika LP tidak ada atau berstatus `draft`, tampilkan 404.
3. Skrip client membaca UTM dari URL dan menyimpannya di sessionStorage (agar tetap tersedia jika user melakukan scroll/refresh internal). **UTM tidak dimodifikasi.**
4. GA4 mencatat `page_view`; Meta Pixel mencatat `PageView` bila diaktifkan.
5. User membaca konten LP (struktur di bawah) dan mengeklik salah satu CTA WhatsApp.
6. Berjalan **Alur klik CTA** (lihat bagian A.4 di bawah / sub-bagian "Alur klik CTA").
7. WhatsApp terbuka dengan pesan prefill yang menyebutkan konteks LP, contoh: `Halo Legal Sakinah, saya ingin konsultasi mengenai hak asuh anak.` (teks final [TBD]).

**Struktur blok LP (urutan default, dapat diatur admin):**

1. Hero: headline, subheadline, CTA primer, badge kredibilitas
2. Masalah/empati: situasi yang dialami calon klien
3. Solusi/layanan: apa yang dibantu Legal Sakinah
4. Proses: tahapan pendampingan (3–5 langkah)
5. Bukti/kredibilitas: pengalaman, testimoni, logo/legalitas [TBD]
6. FAQ ringkas (3–6 item)
7. CTA penutup
8. **Sticky CTA WhatsApp** di bagian bawah layar (mobile) yang selalu terlihat

**Aturan LP:**
- Maksimum satu tujuan konversi: klik WhatsApp. Tidak ada menu, tidak ada link ke halaman lain website.
- Setiap tombol CTA memiliki `cta_label` unik dan deskriptif (contoh `hero_wa`, `sticky_wa`, `footer_wa`, `faq_wa`) agar dapat dibedakan di dashboard.
- Konten LP dikelola lewat CMS sehingga tim marketing dapat membuat varian LP baru untuk kampanye baru tanpa deploy.
- LP harus lolos target performa mobile (lihat Section 6) karena berdampak langsung pada biaya iklan.

---

### C. Alur Internal/Admin (CMS + Dashboard)

Seluruh area ini berada di bawah `/admin` dan wajib login.

#### C.1 Login admin

1. Admin membuka `/admin/login`.
2. Memasukkan email + password → diverifikasi oleh better-auth.
3. Jika berhasil, session cookie (`httpOnly`) dibuat dan admin diarahkan ke `/admin/dashboard`.
4. Jika gagal, tampilkan pesan generik ("Email atau password salah") tanpa membocorkan mana yang salah. Rate limit: maksimal [TBD] percobaan per 15 menit per IP.
5. Session berlaku [TBD] (indikatif 7 hari) dengan opsi logout manual.
6. Akun admin awal dibuat lewat `scripts/seed-admin.ts`. Tidak ada halaman registrasi publik.
7. Reset password: [TBD] (v1 boleh manual lewat script).

#### C.2 Kelola konten dasar (CMS)

Entity yang dapat dikelola pada v1:

| Entity | Operasi | Field utama |
|---|---|---|
| **Services (Layanan)** | Create, Read, Update, Delete/Archive, Reorder, Publish/Unpublish | judul, slug, ringkasan, konten, ikon/gambar, urutan, status, SEO meta |
| **FAQs** | CRUD, Reorder, Publish | pertanyaan, jawaban, kategori, cakupan (global / per layanan / per LP), urutan, status |
| **Team Members (Profil/Tim)** | CRUD, Reorder, Publish | nama, jabatan, foto, bio singkat, keahlian, urutan, status |
| **Pages (Halaman statis)** | Update konten halaman Tentang, Kontak, Kebijakan Privasi | judul, slug, konten, SEO meta, status |
| **Landing Pages** | CRUD, Duplicate, Publish/Unpublish, Preview | slug, headline, subheadline, status, blok konten, nomor WA override, prefill WA, catatan kampanye |
| **Site Settings** | Update | nomor WhatsApp default, teks prefill default, GA4 ID, Meta Pixel ID, info kontak, jam operasional |
| **Articles (Artikel)** | Opsional v1 [TBD] | judul, slug, cover, konten, tanggal terbit, status |

**Perilaku wajib:**
- Slug divalidasi unik dan berformat kebab-case; perubahan slug pada konten yang sudah tayang memunculkan peringatan.
- Aksi "Publish" memicu revalidasi cache halaman terkait sehingga perubahan tampil segera.
- Preview LP draft dapat diakses admin lewat URL preview bertoken ([TBD] mekanisme token).
- Hapus bersifat soft delete (`deleted_at`) untuk entity konten agar bisa dipulihkan.
- Duplicate LP menyalin seluruh blok konten dengan slug baru — mempercepat pembuatan varian kampanye.

#### C.3 Dashboard klik CTA

Halaman `/admin/dashboard` menampilkan performa klik CTA berdasarkan data tabel event di database.

**Komponen dashboard:**

1. **Filter global**
   - Rentang tanggal (preset: Hari ini, 7 hari, 30 hari, Bulan ini, Custom). Default: 30 hari terakhir.
   - Filter opsional: LP/halaman, `utm_source`, `utm_medium`, `utm_campaign`, jenis halaman (LP vs website utama).
   - Zona waktu agregasi: **Asia/Jakarta (WIB)**.

2. **Kartu ringkasan (stat cards)**
   - Total klik CTA pada rentang terpilih
   - Klik dari LP ads vs dari website utama
   - Perbandingan terhadap periode sebelumnya (persentase perubahan)
   - Rasio klik per sesi/pengunjung — hanya jika data page view tersedia; jika tidak, ditandai [TBD]

3. **Grafik tren**
   - Line/bar chart jumlah klik per hari (atau per jam bila rentang = hari ini)

4. **Tabel klik per LP / halaman**
   - Kolom: `lp_slug` atau `page_path`, jumlah klik, kontribusi (%), tanggal klik terakhir
   - Dapat diurutkan, dapat diklik untuk drill-down

5. **Breakdown UTM**
   - Tabel bertingkat / tab: per `utm_source`, per `utm_medium`, per `utm_campaign`, per `utm_content`
   - Menampilkan jumlah klik dan kontribusi (%)
   - Baris tanpa UTM dikelompokkan sebagai `(direct/none)`

6. **Breakdown CTA label**
   - Jumlah klik per `cta_label` (hero, sticky, footer, dst.) untuk mengetahui posisi tombol yang paling efektif

7. **Ekspor**
   - Tombol ekspor CSV sesuai filter aktif

8. **Tabel event terbaru**
   - 50 event terakhir: waktu, halaman, cta_label, UTM, perangkat (mobile/desktop dari user agent)

**Catatan interpretasi (wajib ditampilkan sebagai catatan di UI):**

> Angka pada dashboard ini merepresentasikan **klik CTA (intent)** — yaitu jumlah kali pengunjung menekan tombol WhatsApp. Angka ini **bukan** jumlah percakapan yang benar-benar terjadi, bukan jumlah leads terkualifikasi, dan **bukan konversi closing**. Satu pengunjung dapat menghasilkan lebih dari satu klik. Konversi aktual (percakapan → klien) tidak dilacak oleh sistem pada v1 dan harus dicatat secara terpisah oleh tim.

**Kualitas data:** deduplikasi ringan disarankan — klik berulang dengan `session_id` + `cta_label` + `lp_slug` yang sama dalam jendela [TBD] (indikatif 10 detik) ditandai sebagai duplikat (`is_duplicate = true`) dan dikecualikan dari metrik utama, tetapi tetap tersimpan.

---

#### Alur klik CTA (best practice — wajib diikuti implementasi)

Alur ini berlaku identik untuk CTA di landing page maupun di website utama, dan diimplementasikan **satu kali** di komponen `src/components/shared/whatsapp-cta.tsx`.

1. **User mengeklik tombol WhatsApp** di LP atau website utama.

2. **Client mengirim event ke backend.** Payload dikirim ke `POST /api/events/cta` menggunakan `navigator.sendBeacon()`. Jika `sendBeacon` tidak tersedia atau menolak payload, fallback ke `fetch(url, { method: 'POST', keepalive: true })`. Pengiriman bersifat *fire-and-forget*: **client tidak menunggu respons server**.

   Payload:
   ```json
   {
     "page_path": "/promo-hak-asuh",
     "lp_slug": "promo-hak-asuh",
     "cta_label": "hero_wa",
     "utm_source": "google",
     "utm_medium": "cpc",
     "utm_campaign": "hak-asuh-jkt",
     "utm_content": "var-a",
     "utm_term": null,
     "referrer": "https://www.google.com/",
     "session_id": "b6c1f3d2-...",
     "client_timestamp": "2026-01-15T09:12:31.482Z"
   }
   ```
   `user_agent` dan IP **tidak dikirim dari client**; keduanya diambil server dari header request.

3. **Server memvalidasi & menyimpan ke tabel events.**
   - Validasi payload dengan Zod: whitelist field, batasi panjang string (contoh maks 255 karakter per field UTM, 512 untuk referrer), tolak tipe yang tidak sesuai.
   - Terapkan rate limit sederhana per IP (contoh 20 request/menit; nilai dari `CTA_EVENT_RATE_LIMIT_PER_MINUTE`).
   - Ambil `user_agent` dari header, IP dari `X-Forwarded-For` → simpan **hash IP + salt harian**, bukan IP mentah.
   - `occurred_at` diisi dari waktu server (`now()`); `client_timestamp` disimpan terpisah sebagai referensi.
   - **UTM disimpan apa adanya** (hanya trim + potong panjang). Server tidak melakukan normalisasi/lowercase/mapping.
   - Insert ke tabel `cta_clicks`. Respons `204 No Content` secepat mungkin.
   - Kegagalan penyimpanan **tidak pernah** dikembalikan sebagai error yang mengganggu user; cukup dicatat di log server.

4. **Client membuka WhatsApp.** Segera setelah `sendBeacon` dipanggil (tanpa `await`), navigasi ke `https://wa.me/<nomor>?text=<pesan-prefill-terenkode>`. Jika CTA berupa `<a href>`, biarkan navigasi default berjalan dan cukup panggil `sendBeacon` di handler `onClick` — tidak perlu `preventDefault()`.
   - Nomor WhatsApp: dari `Site Settings`, dapat di-override per LP.
   - Teks prefill: **[TBD]**, mengikuti konteks halaman. Contoh sementara: `Halo Legal Sakinah, saya ingin konsultasi mengenai {topik}.`
   - Target: `target="_blank" rel="noopener noreferrer"` pada desktop; pada mobile navigasi langsung agar aplikasi WhatsApp terbuka.

5. **Mirror ke GA4 (paralel, opsional).** Kirim event GA4 bernama `cta_whatsapp_click` dengan parameter yang sama (page_path, lp_slug, cta_label, UTM). Jika Meta Pixel aktif, kirim juga event `Contact`. Pengiriman ini berjalan paralel dan **tidak boleh** memblokir langkah 4.

   > **Sumber kebenaran dashboard internal adalah database.** GA4 dipakai untuk cross-check dan atribusi iklan; perbedaan angka antara GA4 dan database adalah hal wajar (ad blocker, consent, sampling) dan tidak boleh dianggap sebagai bug selama selisihnya dalam batas wajar.

**Ilustrasi urutan:**

```
[Klik CTA]
   ├─(a) sendBeacon → POST /api/events/cta ──► validasi ──► rate limit ──► INSERT cta_clicks
   ├─(b) gtag('event','cta_whatsapp_click', {...})   [paralel, non-blocking]
   └─(c) navigasi ke https://wa.me/62xxx?text=...    [langsung, tidak menunggu (a)/(b)]
```

---

## 5. Database Entities / Data Model

Database: **PostgreSQL**, dikelola dengan **Drizzle ORM**. Semua tabel memakai `id` UUID (`gen_random_uuid()`) kecuali disebut lain, serta kolom `created_at` dan `updated_at` bertipe `timestamptz`.

> **Aturan privasi (wajib):** sistem **tidak menyimpan isi percakapan WhatsApp**, nomor telepon calon klien, nama, atau identitas pribadi lain dari pengunjung. Yang disimpan hanya metadata klik. IP disimpan dalam bentuk hash bersalt, bukan IP mentah.

### 5.1 Autentikasi admin

#### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text | Nama admin |
| `email` | text UNIQUE NOT NULL | Login |
| `email_verified` | boolean default false | — |
| `image` | text NULL | Avatar opsional |
| `role` | text NOT NULL default `'admin'` | v1 hanya `admin`; nilai lain [TBD] |
| `is_active` | boolean default true | Nonaktifkan tanpa hapus |
| `created_at` / `updated_at` | timestamptz | — |

#### `accounts`
Menyimpan kredensial/provider (struktur mengikuti better-auth).
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `user_id` | uuid FK → `users.id` ON DELETE CASCADE | — |
| `provider_id` | text | v1: `credential` |
| `account_id` | text | — |
| `password` | text NULL | Hash password |
| `created_at` / `updated_at` | timestamptz | — |

#### `sessions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `user_id` | uuid FK → `users.id` ON DELETE CASCADE | — |
| `token` | text UNIQUE NOT NULL | Nilai session cookie |
| `expires_at` | timestamptz NOT NULL | Durasi [TBD], indikatif 7 hari |
| `ip_address` | text NULL | IP admin (internal, boleh disimpan) |
| `user_agent` | text NULL | — |
| `created_at` / `updated_at` | timestamptz | — |

#### `verifications`
Token verifikasi/reset password (dibutuhkan better-auth). Kolom: `id`, `identifier`, `value`, `expires_at`, `created_at`. Pemakaian pada v1 [TBD].

---

### 5.2 Konten CMS

#### `services` — Layanan hukum keluarga
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `slug` | text UNIQUE NOT NULL | URL: `/layanan/{slug}` |
| `title` | text NOT NULL | — |
| `summary` | text | Ringkasan untuk kartu & meta description |
| `content` | text | Rich text (HTML tersanitasi / JSON) |
| `icon` | text NULL | Nama ikon atau path gambar |
| `cover_image_url` | text NULL | — |
| `seo_title` / `seo_description` | text NULL | Override metadata |
| `sort_order` | integer default 0 | Urutan tampil |
| `status` | text NOT NULL default `'draft'` | `draft` \| `published` |
| `published_at` | timestamptz NULL | — |
| `deleted_at` | timestamptz NULL | Soft delete |
| `created_at` / `updated_at` | timestamptz | — |

Index: `slug`, `(status, sort_order)`.

#### `pages` — Halaman statis
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `slug` | text UNIQUE NOT NULL | `tentang`, `kontak`, `kebijakan-privasi` |
| `title` | text NOT NULL | — |
| `content` | text | Rich text |
| `seo_title` / `seo_description` | text NULL | — |
| `status` | text default `'published'` | — |
| `created_at` / `updated_at` | timestamptz | — |

#### `faqs`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `question` | text NOT NULL | — |
| `answer` | text NOT NULL | Rich text ringkas |
| `category` | text NULL | Pengelompokan, contoh `perceraian` |
| `scope` | text default `'global'` | `global` \| `service` \| `landing_page` |
| `service_id` | uuid FK → `services.id` NULL | Diisi bila `scope = service` |
| `landing_page_id` | uuid FK → `landing_pages.id` NULL | Diisi bila `scope = landing_page` |
| `sort_order` | integer default 0 | — |
| `status` | text default `'draft'` | — |
| `deleted_at` | timestamptz NULL | — |
| `created_at` / `updated_at` | timestamptz | — |

#### `team_members` — Profil/tim
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `name` | text NOT NULL | — |
| `role_title` | text | Contoh: Advokat, Partner |
| `photo_url` | text NULL | — |
| `bio` | text NULL | Bio singkat |
| `expertise` | text[] NULL | Daftar keahlian |
| `license_number` | text NULL | Nomor izin advokat, tampil/tidak [TBD] |
| `sort_order` | integer default 0 | — |
| `status` | text default `'draft'` | — |
| `deleted_at` | timestamptz NULL | — |
| `created_at` / `updated_at` | timestamptz | — |

#### `articles` — Artikel edukasi (opsional v1) [TBD]
Kolom indikatif: `id`, `slug` UNIQUE, `title`, `excerpt`, `content`, `cover_image_url`, `author_id` FK → `users.id`, `seo_title`, `seo_description`, `status`, `published_at`, `deleted_at`, `created_at`, `updated_at`.

#### `media_assets`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `file_path` | text NOT NULL | Path lokal atau URL object storage |
| `file_name` | text | Nama asli |
| `mime_type` | text | — |
| `size_bytes` | integer | — |
| `width` / `height` | integer NULL | — |
| `alt_text` | text NULL | Untuk aksesibilitas |
| `uploaded_by` | uuid FK → `users.id` NULL | — |
| `created_at` | timestamptz | — |

Strategi penyimpanan file (disk VPS vs object storage): **[TBD]**.

#### `site_settings`
Tabel key-value bernilai tunggal per kunci, atau satu baris bertipe kolom tetap (implementasi [TBD]). Kunci minimal:

| Key | Keterangan |
|---|---|
| `whatsapp_number_default` | Nomor WA utama, format internasional tanpa `+`. **Dummy v1:** `6281234567890` — diganti nomor resmi sebelum go-live |
| `whatsapp_prefill_default` | Teks prefill default. **Dummy:** `Halo Legal Sakinah, saya ingin konsultasi hukum keluarga.` — final [TBD] |
| `ga4_measurement_id` | [TBD] |
| `meta_pixel_id` | Kosong = nonaktif |
| `office_address`, `office_hours`, `contact_email` | [TBD] |
| `social_links` | JSON, [TBD] |

---

### 5.3 Landing page ads

#### `landing_pages`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `slug` | text UNIQUE NOT NULL | Subdirectory, contoh `promo-hak-asuh` |
| `internal_name` | text | Nama untuk tim (tidak tampil publik) |
| `headline` | text NOT NULL | Judul hero |
| `subheadline` | text NULL | — |
| `hero_image_url` | text NULL | — |
| `campaign_note` | text NULL | Catatan kampanye untuk tim marketing |
| `whatsapp_number_override` | text NULL | Kosong = pakai default dari settings |
| `whatsapp_prefill` | text NULL | Prefill khusus LP, [TBD] |
| `primary_cta_text` | text default `'Konsultasi via WhatsApp'` | — |
| `theme_variant` | text NULL | Varian visual, opsi [TBD] |
| `status` | text NOT NULL default `'draft'` | `draft` \| `published` \| `archived` |
| `noindex` | boolean NOT NULL default true | Selalu true untuk LP ads |
| `published_at` | timestamptz NULL | — |
| `deleted_at` | timestamptz NULL | — |
| `created_by` | uuid FK → `users.id` NULL | — |
| `created_at` / `updated_at` | timestamptz | — |

Index: `slug`, `status`.

#### `landing_page_blocks`
Blok konten LP agar susunan halaman dapat diatur admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `landing_page_id` | uuid FK → `landing_pages.id` ON DELETE CASCADE | — |
| `block_type` | text NOT NULL | `hero` \| `problem` \| `solution` \| `process` \| `proof` \| `faq` \| `cta` \| `custom_html` |
| `content` | jsonb NOT NULL | Struktur per tipe blok, skema detail [TBD] |
| `sort_order` | integer default 0 | — |
| `is_visible` | boolean default true | — |
| `created_at` / `updated_at` | timestamptz | — |

Index: `(landing_page_id, sort_order)`.

---

### 5.4 Tracking event

#### `cta_clicks` — Event klik CTA (tabel inti dashboard)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | — |
| `occurred_at` | timestamptz NOT NULL default `now()` | **Waktu server** — dasar seluruh agregasi |
| `client_timestamp` | timestamptz NULL | Waktu dari client, referensi saja (tidak dipercaya) |
| `page_path` | text NOT NULL | Path halaman, contoh `/promo-hak-asuh` atau `/layanan/hak-asuh-anak` |
| `lp_slug` | text NULL | Diisi bila klik berasal dari LP ads; NULL bila dari website utama |
| `page_type` | text NOT NULL default `'site'` | `lp` \| `site` — mempermudah filter dashboard |
| `cta_label` | text NOT NULL | Contoh `hero_wa`, `sticky_wa`, `footer_wa` |
| `utm_source` | text NULL | Disimpan apa adanya |
| `utm_medium` | text NULL | Disimpan apa adanya |
| `utm_campaign` | text NULL | Disimpan apa adanya |
| `utm_content` | text NULL | Disimpan apa adanya |
| `utm_term` | text NULL | Disimpan apa adanya |
| `referrer` | text NULL | Maks 512 karakter |
| `user_agent` | text NULL | Dari header request, maks 512 karakter |
| `device_type` | text NULL | `mobile` \| `tablet` \| `desktop`, diturunkan dari user agent |
| `ip_hash` | text NULL | **Hash IP + salt harian**, bukan IP mentah |
| `session_id` | text NULL | ID acak dari client (sessionStorage), untuk deduplikasi |
| `is_duplicate` | boolean default false | Ditandai bila klik berulang dalam jendela [TBD] |
| `created_at` | timestamptz default `now()` | — |

**Index yang direkomendasikan:**
- `idx_cta_clicks_occurred_at` pada `(occurred_at DESC)`
- `idx_cta_clicks_lp_time` pada `(lp_slug, occurred_at DESC)`
- `idx_cta_clicks_campaign` pada `(utm_campaign, occurred_at DESC)`
- `idx_cta_clicks_page_type` pada `(page_type, occurred_at DESC)`

**Retensi data:** [TBD] (indikatif 24 bulan). Bila volume besar, pertimbangkan tabel agregat harian (`cta_clicks_daily`) — [TBD] untuk v1.

**Yang DILARANG disimpan di tabel ini:**
- Isi percakapan WhatsApp (apa pun bentuknya)
- Nomor telepon, nama, email, atau identitas pribadi pengunjung
- IP mentah
- Query string mentah selain parameter UTM yang di-whitelist

#### `page_views` — opsional [TBD]
Jika dibutuhkan perhitungan rasio klik per kunjungan di dashboard internal (tidak hanya dari GA4). Kolom indikatif: `id`, `occurred_at`, `page_path`, `lp_slug`, `page_type`, UTM, `session_id`, `device_type`, `ip_hash`. **Keputusan implementasi v1: [TBD]** — jika tidak diimplementasikan, metrik conversion rate di dashboard ditandai sebagai tidak tersedia.

#### `rate_limit_hits` — opsional
Pendukung rate limit sederhana berbasis database bila tidak memakai in-memory. Kolom: `key` (hash IP + endpoint), `window_start`, `count`. Implementasi final [TBD].

### 5.5 Ringkasan relasi

```
users 1─┬─* accounts
        ├─* sessions
        ├─* landing_pages   (created_by)
        └─* media_assets    (uploaded_by)

services 1─* faqs           (scope = 'service')
landing_pages 1─┬─* landing_page_blocks
                └─* faqs    (scope = 'landing_page')

cta_clicks  ── tanpa foreign key ke landing_pages (menyimpan lp_slug sebagai teks,
               agar event historis tetap utuh meskipun LP dihapus/diubah)
```

---

## 6. Design & Technical Constraints

### 6.1 Constraint desain

- **Mobile-first, wajib.** Semua layout dirancang pada breakpoint terkecil terlebih dahulu (360px), lalu ditingkatkan. Traffic iklan didominasi perangkat mobile.
- **LP ads tanpa header/footer.** Route group `(lp)` memakai layout minimal: tidak ada `<nav>`, tidak ada menu, tidak ada link keluar selain CTA WhatsApp dan tautan Kebijakan Privasi berukuran kecil di bagian paling bawah. Logo boleh ditampilkan tetapi **tidak boleh** menjadi link ke beranda.
- **Website utama bernavigasi penuh.** Header sticky dengan menu utama, tombol CTA WhatsApp di header, footer berisi sitemap ringkas, kontak, dan tautan legal.
- **Satu domain, LP di subdirectory.** Contoh: `legalsakinah.id/promo-hak-asuh`. Subdomain tidak digunakan pada v1.
- **CTA utama = WhatsApp**, konsisten di seluruh sistem. Tidak ada form lead sebagai CTA primer pada LP. Form kontak di website utama bersifat sekunder dan opsional ([TBD]).
- **Sticky CTA** wajib ada di LP pada viewport mobile, tidak menutupi konten penting, dan menghormati safe-area iOS.
- **Arah visual via UI UX Pro Max.** Desain **belum final dari klien**. Arah yang ditargetkan: profesional, menenangkan, terpercaya, sesuai konteks hukum keluarga yang sensitif — hindari nuansa agresif/"hard selling" berlebihan, hindari klaim hasil.

**Design token (diisi setelah arah desain disetujui):**

| Token | Nilai | Status |
|---|---|---|
| `--color-primary` | [TBD] | Kandidat: navy/deep green (kesan tepercaya) |
| `--color-accent` | [TBD] | Dipakai untuk CTA WhatsApp |
| `--color-surface`, `--color-muted`, `--color-border` | [TBD] | — |
| Font heading | [TBD] | Kandidat: serif profesional |
| Font body | [TBD] | Kandidat: sans-serif dengan keterbacaan tinggi |
| Skala spacing & radius | [TBD] | — |

> **Implikasi teknis:** karena desain belum final, seluruh warna/tipografi **wajib** dideklarasikan sebagai CSS variable di `src/styles/tokens.css` dan dikonsumsi lewat Tailwind theme. **Dilarang** menuliskan nilai warna hex langsung di komponen, agar pergantian tema tidak menyentuh banyak file.

### 6.2 Constraint SEO & indexing

- LP ads: `robots: { index: false, follow: false }` pada metadata Next.js, dikecualikan dari `app/sitemap.ts`.
- Website utama: indexable, memiliki canonical URL absolut, sitemap otomatis dari konten berstatus `published`.
- Tidak boleh ada duplikasi konten antara LP dan halaman layanan yang bisa menimbulkan kanibalisasi (LP tidak diindeks, sehingga risikonya rendah, tetapi copy tetap perlu dibedakan).

### 6.3 Constraint tracking & UTM

- **UTM tidak diubah server.** Nilai UTM disimpan sebagaimana diterima (hanya `trim` dan pemotongan panjang maksimum). Tidak ada lowercasing, tidak ada mapping alias, tidak ada penggantian nilai kosong menjadi placeholder di level penyimpanan. Normalisasi hanya boleh dilakukan pada lapisan tampilan dashboard.
- UTM dipertahankan selama sesi lewat sessionStorage sehingga klik CTA di bagian bawah halaman tetap membawa atribusi yang benar.
- Meta Pixel bersifat opsional dan hanya aktif bila `NEXT_PUBLIC_META_PIXEL_ID` terisi.
- Cookie consent banner: **[TBD]** — tergantung keputusan kepatuhan klien.

### 6.4 Constraint event CTA (kritis)

- **Pencatatan tidak boleh memperlambat pembukaan WhatsApp secara signifikan.** Target: penundaan tambahan akibat pencatatan event **< 50 ms** yang dirasakan user, idealnya 0 ms.
  - Wajib memakai `navigator.sendBeacon()`; fallback `fetch(..., { keepalive: true })`.
  - **Dilarang** melakukan `await` terhadap request event sebelum navigasi.
  - **Dilarang** memakai `preventDefault()` + `setTimeout` untuk "memastikan event terkirim" — pola ini merusak pengalaman dan sering diblokir popup blocker.
  - Endpoint mengembalikan `204 No Content` tanpa body.
- **Ketahanan kegagalan.** Jika endpoint event gagal (offline, 500, rate-limited), user **tetap** diarahkan ke WhatsApp. Kegagalan pencatatan tidak boleh pernah memblokir konversi.
- **Anti-spam dasar.** Rate limit per IP pada `/api/events/cta` (default 20 request/menit, dapat dikonfigurasi). Request melebihi batas dikembalikan `429` tanpa penyimpanan. Validasi payload ketat dengan Zod; tolak field di luar whitelist; batasi ukuran body (contoh maks 4 KB). Terapkan pemeriksaan `Origin`/`Referer` agar hanya menerima request dari domain sendiri.
- **Jangan log data sensitif berlebih.** Yang dilarang disimpan/di-log: isi percakapan WhatsApp, nomor telepon pengunjung, IP mentah (gunakan hash bersalt), query string penuh di luar UTM yang di-whitelist, dan header `Cookie`. Log server tidak boleh memuat payload event secara utuh pada level `info`.
- **Waktu.** Seluruh timestamp disimpan UTC (`timestamptz`); agregasi dashboard dikonversi ke Asia/Jakarta.
- **Dedup.** Klik ganda tak sengaja disaring dengan aturan `session_id + cta_label + lp_slug` dalam jendela [TBD] (indikatif 10 detik); baris tetap disimpan dan ditandai `is_duplicate`.

### 6.5 Constraint keamanan & infrastruktur

- **SSL wajib.** Let's Encrypt via Certbot dengan auto-renew; HTTP → HTTPS redirect 301; HSTS aktif setelah verifikasi berjalan stabil.
- Security headers di Nginx: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, dan `Content-Security-Policy` ([TBD] karena harus mengakomodasi GA4/Pixel).
- PostgreSQL tidak boleh terekspos ke internet publik.
- Backup DB harian otomatis + uji restore berkala; retensi [TBD].
- Kredensial hanya lewat environment variable; `.env` tidak masuk repository.
- Firewall VPS: hanya port 22 (dibatasi IP bila memungkinkan), 80, dan 443 yang terbuka.

### 6.6 Constraint performa

| Metrik | Target |
|---|---|
| LCP (mobile, 4G) | < 2.5 detik |
| CLS | < 0.1 |
| INP | < 200 ms |
| Lighthouse Performance (mobile, LP) | ≥ 90 |
| Ukuran JS awal per halaman publik | ≤ 150 KB gzip (indikatif) |

- Gambar wajib memakai `next/image` dengan format modern (WebP/AVIF), dimensi eksplisit untuk mencegah layout shift.
- Font dimuat lewat `next/font` dengan `display: swap` dan subset latin.
- Skrip pihak ketiga (GA4, Pixel) dimuat dengan strategi non-blocking (`afterInteractive`).
- LP tidak memuat komponen berat yang tidak diperlukan; hindari animasi yang membebani main thread.

### 6.7 Constraint aksesibilitas (dasar)

- Target WCAG 2.1 AA untuk hal-hal dasar: kontras, fokus keyboard, struktur heading, label form, teks alternatif gambar.
- Sticky CTA tidak boleh menghalangi konten atau menjebak fokus keyboard.
- Accordion FAQ memakai pola ARIA yang benar (`aria-expanded`, `aria-controls`).
- Verifikasi minimal sebelum rilis: audit Lighthouse Accessibility ≥ 90 dan pemeriksaan navigasi keyboard secara manual pada Beranda, satu halaman Layanan, dan satu LP.
- Hormati `prefers-reduced-motion`.

### 6.8 Constraint konten & legal

- Tidak menampilkan opini hukum, prediksi hasil perkara, atau jaminan kemenangan.
- Tidak menampilkan harga, paket, atau quotation di website maupun LP pada v1.
- Testimoni (jika ada) harus atas persetujuan tertulis dan tidak mengungkap identitas perkara — materi dan mekanismenya [TBD] dari klien.
- Disclaimer wajib pada halaman layanan dan LP: informasi bersifat umum dan bukan pengganti konsultasi hukum.
- Seluruh copy final, klaim kredibilitas, dan angka pengalaman: **[TBD]**, menunggu materi dari klien.

### 6.9 Asumsi & item terbuka

| # | Item | Status |
|---|---|---|
| 1 | Nama domain final (`.id` preferred) | [TBD nanti] — development pakai localhost |
| 2 | Nomor WhatsApp resmi & apakah memakai WhatsApp Business API | Dummy sekarang: `6281234567890` — resmi [TBD] sebelum go-live |
| 3 | Teks prefill WhatsApp per LP dan per halaman | Dummy default sudah ada; teks per LP final [TBD] |
| 4 | Palet warna & tipografi final (setelah arah UI UX Pro Max disetujui klien) | [TBD] |
| 5 | Daftar final area praktik / layanan | [TBD] |
| 6 | Materi tim: foto, bio, nomor izin advokat, dan izin tampil | [TBD] |
| 7 | Modul artikel masuk v1 atau tidak | [TBD] |
| 8 | Kebutuhan cookie consent banner | [TBD] |
| 9 | Spesifikasi VPS dan penyedia | [TBD] |
| 10 | Retensi data event dan strategi backup | [TBD] |
| 11 | Penyimpanan media: disk VPS vs object storage | [TBD] |
| 12 | Implementasi tabel `page_views` di v1 | [TBD] |
| 13 | Mekanisme reset password admin | [TBD] |
| 14 | Pilihan rich text editor | [TBD] |
