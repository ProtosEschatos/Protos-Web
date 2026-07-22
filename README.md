# Protos Web

Agency site for **[protosweb.eu](https://www.protosweb.eu)** — a Next.js 16 +
React 19 app deployed to Vercel with Supabase as the backend and a private
`/admin` control panel.

Live: <https://www.protosweb.eu> · Owner: [Dario Imširović](https://www.protosweb.eu/o-nama)

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 3 |
| Language | TypeScript strict |
| i18n | `next-intl` — `hr` (default), `en`, `de`, `it`, `es`, `sr` |
| Backend | Supabase Postgres (`laqnnzavwbojntfiqmxj`) + Row Level Security |
| Auth (admin) | HMAC-SHA256 session cookie (`ADMIN_SECRET`), `HttpOnly` + `Secure` + `SameSite=Lax` |
| Email | Zoho (IMAP inbox) · Resend (transactional) · Brevo (newsletter) |
| Payments | Stripe Checkout Sessions via Supabase Edge Functions (donations) |
| Analytics | Google Analytics 4 · Plausible · Google Business Profile · Vercel Speed Insights |
| 3D | React Three Fiber + drei (`/admin/konfigurator` + homepage background) |
| AI cascade | **GPT-OSS-120B → DeepSeek → Gemini** (`src/lib/ai/providers.ts`) |
| Runtime | Node 22 (see `.nvmrc`) |

---

## Getting started

```bash
nvm use                        # Node 22
npm ci
cp .env.example .env.local     # fill in the required Supabase + admin vars
npm run check-env              # smoke-test env before dev
npm run dev                    # http://localhost:3000
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server (Next.js) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (`--max-warnings 20`) |
| `npm run type-check` | `tsc --noEmit` (strict) |
| `npm run check-env` | Verify required env vars + AI cascade + encryption key |

Asset / showcase / migration helper scripts live under `scripts/`.

---

## Admin panel (`/admin`)

Private control panel on the main domain (not a subdomain). Sections:

| Section | Path | Notes |
| --- | --- | --- |
| Dashboard | `/admin` | Insights, memory, communications, live status, ultimate-panel counters |
| Pages | `/admin/stranice/*` | `o-nama`, `proces`, `usluge` |
| Portfolio | `/admin/portfolio` | Supabase-backed projects |
| Blog | `/admin/blog` | Articles, categories, tags |
| Inbox | `/admin/inbox` | Zoho IMAP (+ Martina) + contact form |
| Donations | `/admin/donacije` | Stripe checkouts (from `/o-nama`) |
| Configurator | `/admin/konfigurator` | R3F scene + Sketchfab + Poly.Pizza + AI chat |
| Subscribers | `/admin/subscribers` | Brevo lists |
| Memory | `/admin/memory` | `Protos-Agent` git-versioned notes |
| AI | `/admin/ai` | GPT-OSS-120B → DeepSeek → Gemini cascade |
| SEO | `/admin/seo` | Analytics, tags, sitemap, robots, content studio |
| API keys | `/admin/kljucevi` | AES-256-GCM vault for provider tokens |
| Automations | `/admin/automations` | Outbound webhooks with SSRF guards |
| Tools | `/admin/tools` | Ad-hoc utilities |

Auth is enforced at two layers: the proxy middleware (`src/proxy.ts` +
`src/lib/auth/admin-paths.ts`) redirects unauthenticated `/admin/*` requests
to `/admin/login`, and every data-fetching function under
`src/lib/queries/admin/**` and `src/actions/**` calls `requireAdmin()`
before touching Supabase. Rate limiting on `/api/admin/login` covers only
failed attempts.

---

## AI cascade

`src/lib/ai/providers.ts` exposes both an explicit-provider chat API (used by
`/admin/ai`) and a JSON-mode cascade (used by `/admin/seo` content studio and
`/admin/konfigurator` scene chat). Order: **GPT-OSS-120B → DeepSeek →
Gemini**. First provider with a configured key wins; the next ones are
failover.

GPT-OSS-120B talks to any OpenAI-compatible chat completions endpoint —
Groq (default), Cerebras, OpenRouter, fal.ai, HuggingFace TGI, vLLM,
LM Studio, Ollama. Override `GPT_OSS_BASE_URL` and `GPT_OSS_MODEL` if you
host it elsewhere.

```env
GPT_OSS_API_KEY=...
GPT_OSS_BASE_URL=https://api.groq.com/openai/v1   # optional
GPT_OSS_MODEL=openai/gpt-oss-120b                 # optional
DEEPSEEK_API_KEY=...                              # optional fallback
GEMINI_API_KEY=...                                # optional fallback
```

---

## Backend

- **Supabase migrations:** `supabase/migrations/*.sql` — CI (`Supabase DB
  push`) applies these on push to `main`. `scripts/assert-migration-history.sh`
  blocks drift.
- **Edge Functions:** `supabase/functions/*` — deployed via
  `.github/workflows/supabase-deploy-functions.yml`. Live:
  `donation-checkout`, `donation-confirm`, `stripe-webhook`, `submit-form`,
  `subscribe`, `content`, `keep-alive`.
- **RLS:** every application table has RLS enabled with `service_role`-only
  writes and narrow public-read policies where intended.
- **Secrets:** never committed. Vercel env vars for the Next.js runtime,
  Supabase Edge secrets for the Deno runtime, GitHub secrets for CI. See
  [`docs/security.md`](./docs/security.md) and
  [`docs/SECRETS-INVENTORY.md`](./docs/SECRETS-INVENTORY.md).

---

## Legacy routes

- `/o-meni` (hr) was renamed to `/o-nama` on 2026-07-20. A permanent **308
  redirect** in `next.config.js` keeps every bookmark, Google index entry, and
  external social link working.
- The `Protos-Web-Vue-Shit` experiment (Vue 3 + Vite + Cloudflare Pages, July
  17–19) was demolished. Repo is archived + private. This tree is
  Next.js + React only.

---

## CI / CD

Workflows under `.github/workflows/`:

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | push/PR to `main` | Type-check, lint, build |
| `security.yml` | push to `main` + weekly cron | `npm audit --audit-level=critical` |
| `supabase-db-push.yml` | push to `supabase/migrations/**` | Apply migrations to remote |
| `supabase-deploy-functions.yml` | push to `supabase/functions/**` | Deploy Edge Functions |
| `supabase-keep-alive.yml` | cron `*/5 * * * *` | Keep the Supabase project awake |
| `cloudflare-dns-check.yml` | manual | Verify DNS matches expected config |
| `admin-inbox-sync.yml` | manual | Trigger `/api/admin/inbox/sync` endpoint |
| `upload-showcase-assets.yml` | push to `public/**` | Push large assets to R2 |

Deploy to Vercel is automatic on push to `main`.

---

## Docs

- [`docs/architecture.md`](./docs/architecture.md) — stack layout, module map
- [`docs/security.md`](./docs/security.md) — auth, secrets, CSP, RLS, threat model
- [`docs/SECRETS-INVENTORY.md`](./docs/SECRETS-INVENTORY.md) — every secret, where it lives
- [`docs/api-ownership.md`](./docs/api-ownership.md) — Next.js vs Edge Functions
- [`docs/admin-console.md`](./docs/admin-console.md) — admin panel walkthrough
- [`docs/email-setup.md`](./docs/email-setup.md) — Zoho / Resend / Brevo wiring
- [`docs/stripe-donations.md`](./docs/stripe-donations.md) — donations flow
- [`docs/cloudflare-dns.md`](./docs/cloudflare-dns.md) — DNS notes
- [`docs/INFRA-AUDIT-REPORT.md`](./docs/INFRA-AUDIT-REPORT.md) — periodic infra audit

Persistent agent memory (session logs, learnings, project summaries) lives in
the sister repo [ProtosEschatos/Protos-Agent](https://github.com/ProtosEschatos/Protos-Agent).

---

## Open items

See [`docs/INFRA-AUDIT-REPORT.md`](./docs/INFRA-AUDIT-REPORT.md) and the
project summary in `Protos-Agent/memory/projects/protos-web.md` for the
live open-item list. As of 2026-07-20 the top items are:

- Tighten CSP `script-src` (remove `'unsafe-eval'`, add nonce-based inline).
- Regenerate `src/lib/database.types.ts` to pick up `page_backgrounds`,
  `agent_memories`, `audit_events` (migrations shipped, types not yet).
- Backfill 27 missing i18n keys in `de/it/es.json` and 4 in `sr.json`
  (System Boost gift-modal copy + several legal-page paragraphs).
- `upload-showcase-assets.yml` red — `SUPABASE_SERVICE_ROLE_KEY` in GitHub
  Secrets returns `403 signature verification failed`. Rotate it: copy the
  current service role key from Supabase Dashboard → Project Settings →
  API → `service_role` → paste into GitHub Secrets. Not blocking the site.
