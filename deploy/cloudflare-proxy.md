# Cloudflare Proxy — legalsakinah.com

**Kenapa ahmadali.id / ahmadalicenter.com jalan tapi ini timeout?**  
Mereka NS-nya Cloudflare (proxied). Legal Sakinah masih NS Domainesia + A langsung ke `187.77.121.126` — dari jaringan lokal path itu timeout. VPS tetap up (asal CF bisa reach origin).

**Tujuan:** samakan pola sibling — traffic lewat Cloudflare orange cloud.  
**Jangan ubah** record email Mailspace (MX / SPF / DKIM / `mail`).

---

## 1. Add site di Cloudflare

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Add a domain** → `legalsakinah.com`
2. Plan: **Free**
3. Cloudflare scan DNS. Pastikan muncul (atau tambah manual):

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| A | `@` | `187.77.121.126` | **Proxied** (orange) |
| A | `www` | `187.77.121.126` | **Proxied** (orange) |
| CNAME | `www` | `legalsakinah.com` | Proxied — *alternatif* kalau pakai CNAME, jangan dobel dengan A www |

4. **Import / biarkan** record email dari Domainesia (**DNS only** / grey cloud):
   - `MX` → Mailspace
   - `TXT` SPF / DKIM / DMARC
   - `A`/`CNAME` `mail` → IP/host Mailspace  
   Jangan orange-cloud-kan `mail`.

5. Catat 2 nameserver Cloudflare (contoh: `xxx.ns.cloudflare.com`).

---

## 2. Ganti NS di Domainesia

1. Login Domainesia → domain `legalsakinah.com` → Nameserver
2. Ganti ke 2 NS Cloudflare
3. Simpan. Propagasi biasanya 5 menit–24 jam (sering &lt; 1 jam)

Cek: `nslookup -type=NS legalsakinah.com` → harus NS Cloudflare, bukan `ns1.domainesia.net`.

---

## 3. SSL di Cloudflare

1. SSL/TLS → Overview → mode **Full (strict)**  
   (origin sudah punya Certbot di VPS)
2. Edge Certificates → **Always Use HTTPS** = On

---

## 4. Smoke test

1. `nslookup legalsakinah.com` → IP Cloudflare (`104.x` / `172.x`), bukan `187.77.121.126`
2. Buka https://legalsakinah.com → harus 200
3. https://legalsakinah.com/admin → login OK
4. https://mail.legalsakinah.com → webmail tetap jalan

Kalau CF sudah proxied tapi masih 521/522: VPS/firewall benar-benar tutup origin — baru cek Hostinger (VPS Running + allow 80/443 dari Cloudflare IP).
