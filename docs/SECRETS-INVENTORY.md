# Secrets inventory — Protos Web

**Updated:** 2026-07-15 · **Commit:** `7dbfc68`  
**Master env template:** [`.env.example`](../.env.example)  
**Security map:** [`security.md`](security.md)  
**Full audit:** [`INFRA-AUDIT-REPORT.md`](INFRA-AUDIT-REPORT.md)

---

## 1. Tri mjesta gdje žive secreti

| Platform | Gdje u dashboardu | Što ide tamo |
|----------|-------------------|--------------|
| **Vercel** | Project → Settings → Environment Variables (Production) | Next.js runtime, admin, IMAP, optional status tokens |
| **GitHub** | Repo → Settings → Secrets and variables → Actions | CI build, Supabase deploy, keep-alive cron, asset upload |
| **Supabase** | Project → Edge Functions → Secrets | Email (Resend/Brevo), Stripe, KEEP_ALIVE |

**Pravilo:** isti secret **ne kopiraj** svugdje. Vidi tablicu ispod po ključu.

---

## 2. GitHub Actions secrets (9 — svi postavljeni 2026-07-15)

| Secret | Status | Koristi |
|--------|--------|---------|
| `SUPABASE_URL` | ✅ radi | CI check-env, keep-alive, REST ping |
| `SUPABASE_ANON_KEY` | ✅ radi | CI check-env, REST ping |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ radi | upload-showcase-assets workflow |
| `SUPABASE_ACCESS_TOKEN` | ✅ radi | db push, edge fn deploy |
| `SUPABASE_PROJECT_REF` | ✅ radi | `laqnnzavwbojntfiqmxj` |
| `KEEP_ALIVE_SECRET` | ✅ radi | keep-alive cron + CI supabase job |
| `CRON_SECRET` | ✅ postavljen | admin-inbox-sync (manual workflow) |
| `CLOUDFLARE_ZONE_ID` | ✅ postavljen | CI cloudflare job |
| `CLOUDFLARE_API_TOKEN` | ⚠️ **403 Invalid token** | CI cloudflare job — **pogrešan tip tokena** (vidi §4) |

---

## 3. Vercel production (iz `.env.example` + SESSION-CHECKPOINT)

### Obavezno za sajt

| Variable | Status | Napomena |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ (live blog/portfolio rade) | Mora = `SUPABASE_URL` na GitHubu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Mora = `SUPABASE_ANON_KEY` na GitHubu |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server actions / admin writes |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://protosweb.eu` |
| `ADMIN_SECRET` | ✅ | /admin login |

### Admin status kartice (opcionalno — “Nije podešeno” dok prazno)

| Variable | Status | Napomena |
|----------|--------|----------|
| `CLOUDFLARE_API_TOKEN` | ⚠️ vidi §4 | **Zone:Read** API token, ne `cfat_` |
| `CLOUDFLARE_ZONE_ID` | ✅ | Isti ID kao GitHub |
| `VERCEL_TOKEN` | ❓ provjeri dashboard | vercel.com/account/tokens |
| `VERCEL_PROJECT_ID` | ❓ | `.vercel/project.json` ili dashboard |
| `VERCEL_TEAM_ID` | opcionalno | team projekti |
| `SENTRY_AUTH_TOKEN` | ❓ | sentry.io → Auth Tokens |
| `SENTRY_ORG_SLUG` | ❌ prazno (checkpoint) | URL organizacije |
| `SENTRY_PROJECT_SLUG` | ❌ prazno | project settings |
| `NEXT_PUBLIC_SENTRY_DSN` | ❓ | error monitoring |

### Admin AI / memory

| Variable | Status |
|----------|--------|
| `DEEPSEEK_API_KEY` | ✅ (checkpoint) |
| `GEMINI_API_KEY` | ✅ (checkpoint) |
| `GITHUB_TOKEN` | ✅ za private Protos-Agent |
| `AGENT_MEMORY_REPO` | default OK |

### IMAP (admin inbox — Vercel only)

| Variable | Status |
|----------|--------|
| `ZOHO_IMAP_USER` / `PASSWORD` | ❌ password prazan u checkpointu |
| `GMAIL_STUDIO_IMAP_*` | ❌ App Password prazan |
| `MARTINA_IMAP_*` | ❌ kad mailbox live |

### Stripe (javni pk na Vercel OK; secret na Supabase)

| Variable | Gdje |
|----------|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel (ako koristiš client) |
| `STRIPE_SECRET_KEY` | **Supabase Edge only** |
| `STRIPE_WEBHOOK_SECRET` | **Supabase Edge only** |

---

## 4. Cloudflare — tri različita tokena (NE miješati)

Ovo je **glavni razlog** zašto CI Cloudflare job pada i zašto token “iz chata” ne pomaže za zone check.

| Token tip | Prefix / izvor | Radi za | Ne radi za |
|-----------|----------------|---------|------------|
| **Cursor agent** | `cfat_...` | Cursor IDE Cloudflare plugin | ❌ `/zones/{id}` API, ❌ DNS records API |
| **DNS Edit** | Cloudflare dashboard → API Tokens | `scripts/fix-cloudflare-dns.sh` | ❌ samo Zone:Read check u CI |
| **Zone Read** | Cloudflare dashboard → Zone → Zone → Read | CI job, `/admin` status, `integrations/cloudflare.ts` | ❌ edit DNS |

**Dokumentirano u:** [`cloudflare-dns.md`](cloudflare-dns.md) linija 14.

**Što napraviti (5 min, ne dira produkciju):**

1. Cloudflare → My Profile → API Tokens → **Create Token**
2. Template: **Read all resources** ili custom: **Zone → Zone → Read** za `protosweb.eu`
3. Kopiraj token (počinje obično drugačije od `cfat_`)
4. GitHub → Protos-Web → Secrets → **Update** `CLOUDFLARE_API_TOKEN`
5. Vercel → Production → **Update** `CLOUDFLARE_API_TOKEN` (admin kartica)
6. Push bilo čega nije potreban — CI sljedeći run će biti zelen za Cloudflare

**DNS produkcija je OK** — `dig` potvrđuje MX/SPF/DMARC. Problem je samo **monitoring token**, ne email niti sajt.

---

## 5. Supabase Edge secrets

| Secret | Funkcije |
|--------|----------|
| `KEEP_ALIVE_SECRET` | keep-alive |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | subscribe, content, keep-alive |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` | submit-form, subscribe |
| `BREVO_API_KEY` | submit-form (fallback), subscribe (primary) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | donation-checkout, stripe-webhook |
| `SITE_URL` | donation-checkout redirects |

Provjera: Supabase Dashboard → Edge Functions → svaka fn → Logs (200 na keep-alive cron).

---

## 6. Što agent MOŽE vs NE MOŽE

### Može (bez tvojih dashboarda)

- Popraviti workflow YAML, `vercel.json`, `package.json`, dokumentaciju
- Mapirati secret imena i gdje moraju biti
- `git push origin main` → Vercel deploy
- `supabase migration list --linked` (ako CLI već linked)
- `gh run list`, `curl` na javne URL-ove

### Ne može (bez tebe — i ne smije “pogađati”)

- Kreirati Cloudflare **Zone:Read** token (moraš ti u dashboardu)
- Rotirati `cfat_` u GitHub secret — **ne bi pomoglo** (krivi tip)
- Čitati Vercel/Supabase dashboard env vrijednosti
- Popuniti IMAP lozinke, `VERCEL_TOKEN`, Sentry slugove
- Brisati migration fileove s remote-a (razbio bi sync)
- Mijenjati `.env*` u repou

### Ne smije (jer razbija drugo)

| Akcija | Zašto ne |
|--------|----------|
| Ukloniti `force-dynamic` na blogu | Vercel build timeout (252 stranice SSG) |
| Obrisati “duplicate” migracije | Sve 38 su na remote — sync pukne |
| Strogi Cloudflare fail bez valjanog tokena | CI crven iako sajt radi |
| `npm install` na Vercel | lockfile drift vs GitHub `npm ci` |
| Force push main | Eksplicitno zabranjeno |

---

## 7. Verifikacija po servisu (2026-07-15)

| Servis | Production | CI/automation | Akcija |
|--------|------------|---------------|--------|
| **Vercel** | ✅ Ready, site 200 | build via push | — |
| **GitHub CI** | — | ✅ success `7dbfc68` | — |
| **Supabase DB** | ✅ 38/38 synced | db push on `.sql` only | — |
| **Supabase Edge** | ✅ 7 fn active | deploy on fn change | — |
| **Cloudflare DNS** | ✅ dig OK | ⚠️ token 403 | Novi Zone:Read token (§4) |
| **Email outbound** | ✅ (Resend/Brevo na Supabase) | — | — |
| **Email inbound** | ✅ MX Zoho | — | IMAP lozinke za /admin/inbox |
| **Stripe donations** | ❓ test checkout | webhook na Supabase | `STRIPE_WEBHOOK_SECRET` u Edge |

---

## 8. Brzi copy checklist

**GitHub (9):** SUPABASE×5, KEEP_ALIVE, CRON, CLOUDFLARE×2  
**Vercel (min):** NEXT_PUBLIC_SUPABASE×2, SERVICE_ROLE, ADMIN_SECRET, SITE_URL  
**Supabase Edge (min):** KEEP_ALIVE, RESEND*, BREVO*, STRIPE*, SITE_URL  

`*` = email/donations stack
