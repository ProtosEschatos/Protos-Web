# Infrastructure Audit Report — Protos Web

**Date:** 2026-07-15 (final pass)  
**Commit:** `7dbfc68` (`fix(ci): pass Supabase secrets to check-env`)  
**Project:** `laqnnzavwbojntfiqmxj` · Production: https://protosweb.eu

**Related:** [`SECRETS-INVENTORY.md`](SECRETS-INVENTORY.md) — puni popis svih ključeva po platformi

---

## 1. Executive summary

| Platform | Production | Automation (CI) | Notes |
|----------|------------|-----------------|-------|
| **GitHub** | — | ✅ CI + Security success on `7dbfc68` | Build, check-env, Supabase ping |
| **Vercel** | ✅ Ready ~58s | auto on push | `npm ci` aligned with GitHub |
| **Supabase** | ✅ site reads DB | ✅ migrations synced, keep-alive cron | 38/38 local=remote |
| **Cloudflare** | ✅ DNS (dig) | ⚠️ CI job 403 | GitHub token = **pogrešan tip** (`cfat_` ≠ Zone API) |

**Live HTTP:** `/` → 200 · `/hr/portfolio-showcase` → 200 · 6 jezika → 200

**Audit upgrades pushed:** `0decf20` + `7dbfc68` (toolchain, docs, CI hardening)

---

## 2. Cloudflare token — zašto “token iz chata” ne popravlja CI

Token spremljen u tvojim env datotekama (Cursor history) počinje s **`cfat_`** — to je **Cursor IDE agent token**, ne Cloudflare API token za zone.

| API poziv | `cfat_` token | Pravi Zone:Read token |
|-----------|---------------|------------------------|
| `GET /zones/{id}` (CI check) | ❌ 403 Invalid | ✅ 200 active |
| `scripts/fix-cloudflare-dns.sh` | ❌ | ✅ (treba DNS **Edit**) |
| Produkcijski DNS (`dig`) | ✅ (ne treba token) | — |

**Zaključak:** Nisam “ignorirao” token — **tip tokena ne podržava** CI/admin zone check. Produkcija nije pogođena. Rješenje: novi token iz Cloudflare dashboarda (5 min) → GitHub + Vercel secret. Detalji: [`SECRETS-INVENTORY.md` §4](SECRETS-INVENTORY.md).

---

## 3. Live status snapshot (2026-07-15, final)

| Check | Result |
|-------|--------|
| GitHub CI (`7dbfc68`) | ✅ success |
| Security Audit | ✅ success |
| Vercel production | ✅ Ready |
| Site + showcase | ✅ 200 |
| Supabase migrations | ✅ 38/38, dry-run clean |
| Supabase keep-alive cron | ✅ scheduled */5 min |
| Cloudflare CI zone API | ⚠️ 403 — rotate token type |
| DNS dig MX/SPF/DMARC | ✅ matches docs |

---

## 4. File inventory

### 4.1 GitHub (9 files)

| File | Trigger | Runtime | Secrets / vars |
|------|---------|---------|----------------|
| `.github/workflows/ci.yml` | push/PR `main` | Node 22 | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `KEEP_ALIVE_SECRET`, `CLOUDFLARE_*`, build env from secrets |
| `.github/workflows/security.yml` | push + Mon 08:00 UTC | Node 22 | — |
| `.github/workflows/supabase-db-push.yml` | push `supabase/migrations/**`, manual | Supabase CLI (pinned) | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` |
| `.github/workflows/supabase-deploy-functions.yml` | push `supabase/functions/**`, manual | Supabase CLI (pinned) | same |
| `.github/workflows/supabase-keep-alive.yml` | cron `*/5 * * * *`, manual | curl | `SUPABASE_URL`, `KEEP_ALIVE_SECRET` |
| `.github/workflows/upload-showcase-assets.yml` | push `public/**` + asset scripts | Node 22 + Pillow | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `.github/workflows/cloudflare-dns-check.yml` | manual only | curl | `CLOUDFLARE_*` |
| `.github/workflows/admin-inbox-sync.yml` | manual only | curl → Vercel | `CRON_SECRET` |
| `.github/dependabot.yml` | monthly | — | npm + github-actions |

**Duplicate coverage:** Cloudflare zone check exists in both `ci.yml` (on every push) and `cloudflare-dns-check.yml` (manual, strict).

### 2.2 Vercel

| File | Purpose |
|------|---------|
| `vercel.json` | Next.js framework, build/install commands, `/hr/*` redirects |
| `next.config.js` | CSP, HSTS, `staticPageGenerationTimeout: 120`, image patterns, Three transpile |
| `src/lib/integrations/vercel.ts` | Admin panel deploy status (`VERCEL_TOKEN`, `VERCEL_PROJECT_ID`) |

### 2.3 Supabase

- **Migrations:** 38 SQL files in `supabase/migrations/` (all local = remote as of audit)
- **Edge functions (7):** `keep-alive`, `submit-form`, `subscribe`, `content`, `donation-checkout`, `donation-confirm`, `stripe-webhook`
- **Config:** `supabase/config.toml` — Postgres 15

### 2.4 Cloudflare

- **Role:** DNS only for `protosweb.eu` (email + apex → Vercel)
- **Docs:** `docs/cloudflare-dns.md`
- **Script:** `scripts/fix-cloudflare-dns.sh` (DNS Edit token — stronger than CI read-only)
- **Admin:** `src/lib/integrations/cloudflare.ts` (Zone:Read)
- **External:** `protos-system-boost.pages.dev` (Cloudflare Pages, out of repo; CSP `frame-src` in next.config)

### 2.5 npm scripts & `scripts/`

| Script | CI / manual |
|--------|-------------|
| `dev`, `build`, `lint`, `type-check` | CI build job |
| `check-env` | CI build job (added in audit upgrade) |
| `upload:production-assets` | upload-showcase-assets workflow |
| `upload:showcase-assets`, `sync:*` | manual |
| `normalize/cleanup/capture-showcase-*` | partial in workflow |
| `scripts/fix-cloudflare-dns.sh` | manual |
| `scripts/generate-sr-locale.mjs` | manual |

---

## 3. Live status snapshot (2026-07-15)

| Check | Result |
|-------|--------|
| GitHub CI (`8e14292`) | success (58s) |
| Security Audit | success |
| Vercel production | Ready, ~58s |
| `curl https://protosweb.eu/` | 200 |
| `curl .../hr/portfolio-showcase` | 200 |
| `supabase migration list --linked` | 38/38 local = remote |
| `supabase db push --dry-run` | Remote up to date |
| `dig MX protosweb.eu` | mx.zoho.eu + mx2/mx3 |
| `dig TXT protosweb.eu` | SPF (Zoho + Brevo), brevo-code, zoho-verification |
| `dig TXT _dmarc.protosweb.eu` | DMARC rua → dario.admin@ |

---

## 4. Secret matrix

| Secret | Vercel | GitHub | Supabase Edge | Used by |
|--------|--------|--------|---------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | — | — | Next.js client/server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | as `SUPABASE_ANON_KEY` in CI | — | Client + CI REST check |
| `SUPABASE_URL` | optional alias | yes | yes | CI, keep-alive, edge fns |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | assets workflow | yes | Server actions, upload scripts |
| `SUPABASE_ACCESS_TOKEN` | — | yes | — | db push, fn deploy |
| `SUPABASE_PROJECT_REF` | — | yes | — | `laqnnzavwbojntfiqmxj` |
| `KEEP_ALIVE_SECRET` | — | yes | yes | keep-alive edge fn |
| `ADMIN_SECRET` | yes | — | **no** | /admin auth |
| `CRON_SECRET` | yes | yes | — | inbox sync API |
| `CLOUDFLARE_API_TOKEN` | optional | optional | — | admin + CI zone check |
| `CLOUDFLARE_ZONE_ID` | optional | optional | — | same |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` | optional | — | — | admin status |
| Resend/Brevo/Stripe keys | **no** | **no** | yes | email + donations |

**Naming note:** GitHub CI uses `SUPABASE_URL`; app prefers `NEXT_PUBLIC_SUPABASE_URL`. Values must be identical.

---

## 5. Findings (P0–P3)

### P0 — Fixed in this audit

| # | Issue | Evidence | Fix |
|---|-------|----------|-----|
| 1 | Vercel `npm install` vs GitHub `npm ci` | `vercel.json` vs `ci.yml` | `installCommand: npm ci` |
| 2 | No `engines` / `.nvmrc` | local Node 24 vs CI Node 22 | `engines.node >=22`, `.nvmrc` |
| 3 | Supabase CLI `version: latest` | workflows | Pin `2.109.1` |
| 4 | Lockfile regen risk | prior CI failure on npm ci | Regenerate with Node 22 / npm 10 |

### P1 — Fixed / documented

| # | Issue | Fix |
|---|-------|-----|
| 5 | Cloudflare CI token | GitHub secret = `cfat_` type → 403 on Zone API | Job `continue-on-error: true`; **user creates Zone:Read token** — see SECRETS-INVENTORY §4 |
| 6 | `check-env.mjs` not in CI | Added `npm run check-env` to build job |
| 7 | Blog `force-dynamic` | Documented tradeoff; keep until SSG strategy tested |
| 8 | Stale `migrations/README.md` (said 24) | Updated to 38 + duplicate pairs |

### P2 — Backlog

| # | Issue | Recommendation |
|---|-------|----------------|
| 9 | Keep-alive: GitHub cron + edge fn (pg_cron removed) | Document canonical path; cron is source of truth |
| 10 | Admin inbox sync manual-only | Runbook in architecture.md |
| 11 | Dependabot ignores major Next/React | Quarterly manual stack review |
| 12 | Security audit critical-only | Monitor 2 moderate npm advisories |

### P3 — Separate from infra

| # | Issue | Recommendation |
|---|-------|----------------|
| 13 | Showcase lag mobile/laptop | Viewport-aware perf PR (not mixed with infra) |

---

## 6. Migration duplicate pairs (on remote — do not delete)

These pairs exist **both locally and on remote**. Removing files would break `migration list` sync.

| Pair | Topic |
|------|-------|
| `20260702115818` / `20260702120000` | showcase bucket |
| `20260706001900` / `20260706002434` | design_elements |
| `20260706002000` / `20260706002707` | seed design |
| `20260706003000` / `20260714221121` | admin design seed |
| `20260711010955` / `20260711030000` | blog author slug |
| `20260711150000` / `20260714221113` | donations |
| `20260712224047` / `20260713003000` | admin mail sync |
| `20260715122913` / `20260715141417` | pg_cron add + remove |

Future cleanup requires Supabase support or careful remote history surgery — **not recommended** without explicit approval.

---

## 7. Upgrade plan status

| PR | Description | Status |
|----|-------------|--------|
| PR-1 | Toolchain: engines, .nvmrc, vercel npm ci, lockfile | Applied |
| PR-2 | CI: pin CLI, check-env, Cloudflare strict | Applied |
| PR-3 | Migration README sync (no file deletion) | Applied |
| PR-4 | architecture.md + this report | Applied |
| PR-5 | Blog ISR/SSG strategy | Backlog |
| PR-6 | Showcase perf | Backlog |

---

## 8. Pre-push checklist

1. `npm ci && npm run check-env && npm run lint && npm run type-check && npm run build`
2. Manual test `/portfolio-showcase` 2 min (mobile + desktop) — movement smooth, no spin
3. One logical commit per concern when possible
4. Confirm GitHub CI green before declaring production fixed
5. Poklon URL remains `https://protos-system-boost.pages.dev/`
6. Do not edit `.env*` in repo; rotate secrets in dashboards only

---

## 10. Cannot fix without breaking something else

| Item | Why blocked | Safe path |
|------|-------------|-----------|
| Blog SSG all locales | Vercel 60s timeout × 252 pages | Keep `force-dynamic`; PR-5 later with HR-only ISR |
| Delete duplicate migrations | All 38 on remote | Never delete; documented pairs only |
| Use `cfat_` for CI Cloudflare | API rejects token type | Separate Zone:Read token |
| Strict Cloudflare CI without valid token | Blocks merge, site still works | `continue-on-error` until token rotated |
| Showcase perf + infra in one PR | Regression risk | PR-6 separate |
| Force push / rewrite git | User forbidden | Linear commits on main |

---

## 11. Upgrade plan status (final)

| PR | Status |
|----|--------|
| PR-1 Toolchain | ✅ `0decf20` |
| PR-2 CI hardening | ✅ `7dbfc68` (check-env env map, CLI pin, db-push `*.sql` only) |
| PR-3 Migration docs | ✅ README 38 migrations |
| PR-4 Docs | ✅ architecture, INFRA-AUDIT, SECRETS-INVENTORY |
| PR-5 Blog SSG | Backlog |
| PR-6 Showcase perf | Backlog |
| **User action** | Cloudflare Zone:Read token → GitHub + Vercel |

---

## 9. Dashboard verification checklist (manual)

Use this after any secret rotation:

- [ ] **GitHub** → Settings → Secrets: all rows in section 4 present
- [ ] **Vercel** → Project → Environment Variables: production vars match `.env.example` groups
- [ ] **Supabase** → Edge Functions → Secrets: email + Stripe + KEEP_ALIVE
- [ ] **Cloudflare** → DNS: apex grey-cloud to Vercel, MX/SPF/DMARC unchanged
- [ ] **Vercel** → Domains: `protosweb.eu`, `www.protosweb.eu` active
