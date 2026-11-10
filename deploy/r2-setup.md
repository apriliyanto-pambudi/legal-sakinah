# Cloudflare R2 — Legal Sakinah (per domain)

Bucket/prefix khusus Legal Sakinah. Jangan campur object Ahmadali di prefix yang sama.

## 1. Cloudflare
1. R2 → Create bucket (contoh: `legal-sakinah`)
2. Settings → Public access → R2.dev subdomain **atau** Custom Domain `media.legalsakinah.com`
3. Manage R2 API Tokens → Create API token (Object Read & Write) untuk bucket ini
4. Catat: Account ID, Access Key ID, Secret Access Key, Public URL

## 2. Env VPS (`/var/www/apps/legalsakinah.com/.env`)
```env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=legal-sakinah
R2_KEY_PREFIX=legalsakinah
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

Lalu `pnpm build && pm2 restart legalsakinah-com` (NEXT_PUBLIC_* perlu rebuild).

## 3. Migrasi foto lama (opsional)
Upload manual file di `/var/www/shared/legalsakinah.com/uploads` atau `public/uploads` ke R2 di path:
`legalsakinah/home/...`, `legalsakinah/team/...`, `legalsakinah/lp/...`
Lalu update URL di CMS/DB jika path berubah.
