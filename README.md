# Protos Web

Agency website for **Protos Web** (Zagreb) — live at **[protosweb.eu](https://protosweb.eu)** and **[www.protosweb.eu](https://www.protosweb.eu)**.

**Repo:** [github.com/ProtosEschatos/Protos-Web](https://github.com/ProtosEschatos/Protos-Web)  
**Deploy:** `git push origin main` → Vercel (no Vercel CLI deploy)  
**Backend:** Supabase only (`laqnnzavwbojntfiqmxj`) — Postgres, Storage, Edge Functions

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 3, Framer Motion, Lenis smooth scroll |
| 3D | React Three Fiber + Three.js (`/portfolio-showcase`) |
| i18n | next-intl 4 — **6 locales:** hr (default), en, de, it, es, sr |
| Data | Supabase (anon client + service role for admin) |
| Analytics | GA4 (`G-HR9HK4SR7Q`, consent-gated) + Vercel Speed Insights |
| Hosting | Vercel |
| DNS | Cloudflare |

Node **20** (matches GitHub Actions CI).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill Supabase + ADMIN_SECRET (copy from Vercel dashboard)
npm run dev                    # http://localhost:3000
```

Production check:

```bash
npm run lint && npm run type-check && npm run build && npm start
```

### npm scripts

| Script | Purpose |
|--------|---------|
| `dev` | Next.js dev server |
| `build` | Production build |
| `start` | Serve production build |
| `lint` | ESLint 9 (`eslint.config.mjs`) |
| `type-check` | `tsc --noEmit` |
| `upload:showcase-assets` | Upload 3D showcase assets to Supabase Storage |
| `cleanup:showcase-assets` | Remove orphaned showcase objects from Storage |

---

## Public site map

Route segments stay **Croatian** (`/proces`, `/o-meni`, …). Non-default locales use prefix when needed (`/en/blog`, …).

| Path | Page |
|------|------|
| `/` | Home — hero, services, process, portfolio preview, blog preview, contact |
| `/o-meni` | About — team, mission, **Stripe donations** (1–1000 EUR) |
| `/proces` | Process |
| `/portfolio` | Portfolio grid (Supabase CMS) + link to 3D showcase |
| `/portfolio-showcase` | Full-screen **3D space gallery** (WASD / touch; no site header) |
| `/usluge` | Services |
| `/blog`, `/blog/[slug]` | Blog listing + post (Supabase, markdown) |
| `/kontakt` | Contact form |
| `/terms`, `/privacy`, `/cookies` | Legal pages (header + footer, no boot gate) |

**SEO:** dynamic sitemap (~147 URLs), `robots.txt` (blocks `/admin`, `/api/`), hreflang alternates, OG images via `/api/og`, Google Search Console meta verification.

**Consent:** single `SiteConsentModal` (terms + privacy + cookies) + Google Consent Mode v2 — not a separate cookie banner.

---

## Admin panel

**URL:** [protosweb.eu/admin](https://www.protosweb.eu/admin)  
**Auth:** `ADMIN_SECRET` on **Vercel only** (HttpOnly session, rate-limited login)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — stats, inbox summary, service status |
| `/admin/inbox` | Zoho + Gmail studio IMAP + contact form submissions |
| `/admin/donacije` | Stripe donations (`donations` table) |
| `/admin/blog`, `/admin/portfolio` | CMS CRUD |
| `/admin/stranice/*` | Static page copy hints (i18n in `src/messages/`) |
| `/admin/subscribers` | Newsletter list |
| `/admin/memory` | Protos-Agent repo viewer (`GITHUB_TOKEN` if private) |
| `/admin/ai` | DeepSeek / Gemini assistant |
| `/admin/tools` | Hub links — Vercel, Cloudflare, Supabase, Stripe, Resend, Brevo, GA4, Search Console, social |

Full UI reference: [`docs/admin-console.md`](docs/admin-console.md)

---

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Contact form → Supabase RPC → email via edge fn |
| `/api/subscribe` | POST | Newsletter → edge fn `subscribe` |
| `/api/donate` | POST | Stripe Checkout → edge fn `donation-checkout` |
| `/api/donate/confirm` | POST | Post-checkout confirmation |
| `/api/blog` | GET | Public blog JSON |
| `/api/og` | GET | Dynamic Open Graph images |
| `/api/admin/login` | POST | Admin session |
| `/api/admin/logout` | POST | Clear session |
| `/api/admin/session` | GET | Session check |
| `/api/admin/ai` | POST | Admin AI chat |
| `/api/admin/notifications/badge` | GET | Admin notification count |
| `/api/cron/sync-inbox` | GET | IMAP sync (Bearer `CRON_SECRET`) |

Ownership detail: [`docs/api-ownership.md`](docs/api-ownership.md)

---

## Services on protosweb.eu

Everything wired to the live domain:

| Service | Role | Where configured |
|---------|------|-------------------|
| **Vercel** | Host + env for Next.js | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Cloudflare** | DNS — apex, www, MX, Resend/Brevo/DMARC | [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md) |
| **Supabase** | DB, Storage (`showcase` bucket), Edge Functions | Dashboard project `laqnnzavwbojntfiqmxj` |
| **Zoho Mail** | Receive at `dario.admin@protosweb.eu` | Cloudflare MX → IMAP in admin |
| **Resend** | Send — contact form (primary) | Supabase Edge secrets |
| **Brevo** | Send — newsletter (primary), contact fallback | Supabase Edge secrets |
| **Stripe** | Donations 1–1000 EUR from `/o-meni` | Supabase Edge secrets + webhook |
| **Google Analytics 4** | Traffic (consent-gated) | `NEXT_PUBLIC_GA_ID` or code default |
| **Google Search Console** | Indexing / CWV | DNS + meta verification |
| **GitHub Actions** | CI, keep-alive, edge deploy, security audit | Repo secrets |
| **DeepSeek** | `/admin/ai` | `DEEPSEEK_API_KEY` on Vercel |
| **Protos-Agent** | `/admin/memory` (read-only) | Optional `GITHUB_TOKEN` on Vercel |

Admin quick links mirror this in `/admin/tools` (`src/lib/config/admin-links.ts`).

---

## Environment variables

Copy [`.env.example`](.env.example) → `.env.local` for local dev. **Never commit secrets.**

Full placement table (Vercel vs Supabase vs GitHub vs Cloudflare): **[`docs/security.md`](docs/security.md)**

### Vercel — required for live site

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://protosweb.eu` (must match `src/lib/config/site.ts`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin CMS, cron, server reads |
| `ADMIN_SECRET` | Admin login password |

### Vercel — optional (features unlock when set)

| Variable | Feature |
|----------|---------|
| `NEXT_PUBLIC_GA_ID` | GA4 override (default in code) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Error monitoring |
| `DEEPSEEK_API_KEY` / `GEMINI_API_KEY` | `/admin/ai` |
| `GITHUB_TOKEN` + `AGENT_MEMORY_*` | `/admin/memory` |
| `ZOHO_IMAP_*`, `GMAIL_STUDIO_IMAP_*`, `MARTINA_IMAP_*` | `/admin/inbox` |
| `CLOUDFLARE_*`, `SENTRY_*`, `VERCEL_*` | Live status cards on admin dashboard |
| `CRON_SECRET` | `/api/cron/sync-inbox` + GitHub workflow `admin-inbox-sync` |

### Supabase Edge secrets (not Vercel)

| Secret | Used by |
|--------|---------|
| `RESEND_API_KEY`, `BREVO_API_KEY` | `submit-form`, `subscribe` |
| `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` | Email from / to `dario.admin@protosweb.eu` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Donations |
| `SITE_URL` | Stripe redirect URLs (`https://www.protosweb.eu`) |
| `KEEP_ALIVE_SECRET` | `keep-alive` edge fn |

Email setup: [`docs/email-setup.md`](docs/email-setup.md) · Stripe: [`docs/stripe-donations.md`](docs/stripe-donations.md)

### GitHub repo secrets

| Secret | Used by |
|--------|---------|
| `SUPABASE_URL` | CI + keep-alive cron |
| `SUPABASE_ANON_KEY` | CI REST check |
| `SUPABASE_SERVICE_ROLE_KEY` | CI build |
| `KEEP_ALIVE_SECRET` | Keep-alive cron |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` | Edge function deploy on push |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` | Optional DNS health in CI |
| `CRON_SECRET` | Manual inbox sync workflow |

---

## Supabase Edge Functions

| Function | Trigger |
|----------|---------|
| `keep-alive` | GitHub cron every 5 min |
| `submit-form` | DB webhook on `contacts` INSERT |
| `subscribe` | `POST /api/subscribe` |
| `donation-checkout` | `POST /api/donate` |
| `donation-confirm` | `POST /api/donate/confirm` |
| `stripe-webhook` | Stripe webhook endpoint |
| `content` | Generic DB content API (service role) |

Deploy: automatic on push to `main` when `supabase/functions/**` changes.  
Details: [`supabase/functions/README.md`](supabase/functions/README.md)

---

## CI / GitHub Actions

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push / PR → `main` | lint, type-check, build, Supabase ping |
| `supabase-keep-alive.yml` | cron (5 min) | Prevent free-tier pause |
| `supabase-deploy-functions.yml` | push → `main` | Deploy edge functions |
| `supabase-db-push.yml` | push (migrations) | DB migration check |
| `security.yml` | push + weekly | `npm audit` (critical) |
| `cloudflare-dns-check.yml` | manual | DNS zone verification |
| `admin-inbox-sync.yml` | manual | IMAP cache sync via production API |
| `upload-showcase-assets.yml` | manual | Showcase Storage upload |

---

## Project structure

```
src/
├── app/
│   ├── [locale]/                 # Locale routing (hr default, as-needed prefix)
│   │   ├── layout.tsx            # Fonts, AppChrome, Analytics, Consent Mode
│   │   ├── page.tsx              # Home
│   │   ├── o-meni/               # About + donations
│   │   ├── proces/ usluge/ kontakt/
│   │   ├── portfolio/            # CMS grid
│   │   ├── portfolio-showcase/   # 3D SpaceGallery (no site chrome)
│   │   ├── blog/ blog/[slug]/
│   │   ├── terms/ privacy/ cookies/
│   │   └── admin/                # Console v3.0 (see docs/admin-console.md)
│   └── api/                      # Thin proxies + admin auth (see api-ownership.md)
├── components/
│   ├── features/                 # home sections, admin, blog, portfolio, donations
│   ├── layout/                   # Header, Footer, AppChrome, MobileMenu
│   ├── legal/                    # SiteConsentModal
│   ├── three/                    # R3F backgrounds + showcase
│   └── ui/                       # PageLoader, SiteBackground, CustomCursor
├── lib/
│   ├── config/                   # site.ts, seo.ts, admin-links.ts, boot-gate, site-consent
│   ├── queries/                  # blog, portfolio, admin
│   ├── routes/                   # main-nav, localized paths, showcase-path
│   ├── showcase/                 # webgl helpers, storage
│   └── supabase.ts
├── actions/                      # Server actions (admin CMS, contact)
├── messages/                     # hr, en, de, it, es, sr JSON
├── styles/                       # globals.css, admin-console.css
├── i18n.ts / middleware.ts
supabase/
├── functions/                    # Edge functions (see README inside)
└── migrations/                   # Postgres schema
docs/                             # Architecture, security, email, Stripe, DNS, admin
public/.well-known/security.txt
```

---

## Config files

| File | Purpose |
|------|---------|
| `next.config.js` | next-intl plugin, Three.js transpile, security headers, CSP |
| `eslint.config.mjs` | ESLint 9 flat config + `eslint-config-next` |
| `tailwind.config.ts` | Protos theme tokens and animations |
| `tsconfig.json` | Strict TS, `@/*` alias |
| `postcss.config.js` | Tailwind + Autoprefixer |

---

## Theme

Dark theme only. Primary accent `#ff6600` (orange), secondary `#8b5cf6`, accent cyan `#06b6d4`, background `#0a0a1a`.

Admin panel uses separate slate/indigo Console v3.0 theme (`.admin-console` in `admin-console.css`).

---

## Documentation index

| Doc | Contents |
|-----|----------|
| [`docs/architecture.md`](docs/architecture.md) | Stack, Supabase ownership, UI zones |
| [`docs/security.md`](docs/security.md) | Secret placement, admin auth, headers |
| [`docs/admin-console.md`](docs/admin-console.md) | Admin UI, routes, IMAP env |
| [`docs/api-ownership.md`](docs/api-ownership.md) | Who owns each API flow |
| [`docs/email-setup.md`](docs/email-setup.md) | Zoho + Resend + Brevo wiring |
| [`docs/stripe-donations.md`](docs/stripe-donations.md) | Stripe Checkout + webhook |
| [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md) | DNS records for protosweb.eu |
| [`docs/compatibility.md`](docs/compatibility.md) | Browsers, mobile showcase, testing |
| [`supabase/functions/README.md`](supabase/functions/README.md) | Edge fn deploy + secrets |

---

## Development notes

1. **Supabase is live** — blog, portfolio, contact, donations use remote DB; local dev needs `.env.local` from Vercel.
2. **3D uses R3F** — dynamically imported with `ssr: false`; do not force-upgrade Three.js without testing showcase.
3. **Showcase path** — `/portfolio-showcase` is immersive 3D; `/portfolio` is normal site page with grid.
4. **Email never sends from Next.js** — contact/newsletter go through Supabase Edge Functions.
5. **Stripe keys on Supabase only** — Vercel proxies `/api/donate` to edge; webhook hits Supabase directly.
6. **Boot gate** — skipped on `/admin`, `/portfolio-showcase`, and legal pages.
7. **Performance** — run Lighthouse against `npm run build && npm start`, not dev mode.

### Vercel build warnings

Transitive `npm warn deprecated` (e.g. old eslint/glob peers) during install are normal and do not fail the build.

---

## Contact

**Protos Web** · Zagreb, Croatia  
**Email:** dario.admin@protosweb.eu  
**Site:** https://protosweb.eu
