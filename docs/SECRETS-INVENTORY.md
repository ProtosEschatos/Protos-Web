# Secrets inventory — Protos Web

**Updated:** 2026-07-15 · **Commit:** post-`c042990` docs sync  
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
| `CLOUDFLARE_API_TOKEN` | ✅ radi (CI run 29430523905) | CI cloudflare job — `cfat_` OK za zone read (vidi §4) |

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
| `CLOUDFLARE_API_TOKEN` | ⚠️ provjeri dashboard | Isti token kao GitHub; `cfat_` radi zone read u CI — kopiraj za admin karticu |
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
| `GPT_OSS_API_KEY` | AI cascade primary (Groq / Cerebras / OpenRouter / fal.ai / self-host) |
| `GPT_OSS_BASE_URL` | Optional override — default `https://api.groq.com/openai/v1` |
| `GPT_OSS_MODEL` | Optional override — default `openai/gpt-oss-120b` |
| `DEEPSEEK_API_KEY` | AI cascade fallback #1 |
| `GEMINI_API_KEY` | AI cascade fallback #2 |
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

### Ko-fi (tip jar)

| Variable | Gdje | Napomena |
|----------|------|----------|
| `KO_FI_API_KEY` | **Vercel Production** ✅ | Server-only; nije NEXT_PUBLIC. Za API/webhooks kad ih dodamo. |
| Stranica | javni URL | https://ko-fi.com/protoswebmark23 |

**Ne** treba na GitHub Actions ni Supabase dok nema workflowa / edge fn koji zove Ko-fi API.

---

## 4. Cloudflare — tri različita tokena (NE miješati)

| Token tip | Prefix / izvor | Radi za | Ne radi za |
|-----------|----------------|---------|------------|
| **Cursor agent** | `cfat_...` | Cursor IDE plugin, ✅ `GET /zones/{id}` (CI), `/admin` zone status | ❌ `/zones/.../dns_records` (DNS edit) |
| **DNS Edit** | Cloudflare dashboard → API Tokens | `scripts/fix-cloudflare-dns.sh` | ❌ nije potreban za CI zone check |
| **Zone Read** | Cloudflare dashboard → Zone → Zone → Read | CI job, `/admin` status, `integrations/cloudflare.ts` | ❌ edit DNS |

**Status (2026-07-15):** GitHub `CLOUDFLARE_API_TOKEN` = `cfat_` → CI Cloudflare job **zelen** (run 29430523905). Zone read radi; DNS edit skripte i dalje trebaju poseban dashboard token.

**Dokumentirano u:** [`cloudflare-dns.md`](cloudflare-dns.md).

**Ako trebaš mijenjati DNS zapise** (ne za CI monitoring):

1. Cloudflare → My Profile → API Tokens → **Create Token**
2. Custom: **Zone → DNS → Edit** + **Zone → Zone → Read** za `protosweb.eu`
3. Spremi u lokalni env / `~/.config/kilo/.env` — **ne** u GitHub CI secret (cfat je dovoljan za CI)

**Opcionalno (admin + Vercel):** kopiraj isti `cfat_` token u Vercel Production → `CLOUDFLARE_API_TOKEN` da `/admin` status kartica radi.

**Sigurnost:** ako je token bio u chatu, rotiraj u Cloudflareu i ažuriraj GitHub + Vercel secret.

**DNS produkcija je OK** — `dig` potvrđuje MX/SPF/DMARC. Ne ovisi o API tokenu.

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

- Kreirati Cloudflare **DNS Edit** token za skripte (moraš ti u dashboardu)
- Rotirati token ako je bio izložen u chatu — ažuriraj GitHub + Vercel secret
- Čitati Vercel/Supabase dashboard env vrijednosti
- Popuniti IMAP lozinke, `VERCEL_TOKEN`, Sentry slugove
- Brisati migration fileove s remote-a (razbio bi sync)
- Mijenjati `.env*` u repou

### Ne smije (jer razbija drugo)

| Akcija | Zašto ne |
|--------|----------|
| Ukloniti `force-dynamic` na blogu | Vercel build timeout (252 stranice SSG) |
| Obrisati “duplicate” migracije | Sve 38 su na remote — sync pukne |
| Cloudflare CI bez tokena | Job skip — ne blokira build |
| `npm install` na Vercel | lockfile drift vs GitHub `npm ci` |
| Force push main | Eksplicitno zabranjeno |

---

## 7. Verifikacija po servisu (2026-07-15)

| Servis | Production | CI/automation | Akcija |
|--------|------------|---------------|--------|
| **Vercel** | ✅ Ready, site 200 | build via push | — |
| **GitHub CI** | — | ✅ success (run 29430523905) | — |
| **Supabase DB** | ✅ 38/38 synced | db push on `.sql` only | — |
| **Supabase Edge** | ✅ 7 fn active | deploy on fn change | — |
| **Cloudflare DNS** | ✅ dig OK | ✅ zone API (cfat_) | DNS Edit token samo za skripte (§4) |
| **Email outbound** | ✅ (Resend/Brevo na Supabase) | — | — |
| **Email inbound** | ✅ MX Zoho | — | IMAP lozinke za /admin/inbox |
| **Stripe donations** | ❓ test checkout | webhook na Supabase | `STRIPE_WEBHOOK_SECRET` u Edge |

---

## 8. Brzi copy checklist

**GitHub (9):** SUPABASE×5, KEEP_ALIVE, CRON, CLOUDFLARE×2  
**Vercel (min):** NEXT_PUBLIC_SUPABASE×2, SERVICE_ROLE, ADMIN_SECRET, SITE_URL  
**Supabase Edge (min):** KEEP_ALIVE, RESEND*, BREVO*, STRIPE*, SITE_URL  

`*` = email/donations stack
