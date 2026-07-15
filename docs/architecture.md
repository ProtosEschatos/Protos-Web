# Architecture — Protos Web

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind, Framer Motion, Lenis |
| 3D | React Three Fiber + Three.js (`SiteBackground`, `SpaceGallery`) |
| i18n | next-intl — hr, en, de, it, es, sr |
| **Backend** | **Supabase only** — Postgres, RLS, Storage, Edge Functions |
| Deploy | GitHub → Vercel (`git push origin main`) |
| DNS | Cloudflare |

**Supabase project:** `laqnnzavwbojntfiqmxj`

There is no Prisma, Firebase, or separate Node API server. Next.js API routes call Supabase (anon or service role) or proxy to Supabase Edge Functions. Route vs edge ownership: [`docs/api-ownership.md`](api-ownership.md).

## What Supabase owns (backend)

| Concern | Where |
|---------|--------|
| Blog, portfolio, contacts, subscribers | Postgres tables + RLS |
| Admin CMS writes | `supabaseAdmin` (service role) in server actions |
| Contact email | Edge `submit-form` (Resend secret on Supabase) |
| Newsletter | Edge `subscribe` |
| Donations | Edge `donation-checkout`, `stripe-webhook`, `donation-confirm` — **Stripe keys on Supabase Edge, not Vercel** |
| Keep-alive | Edge `keep-alive` + GitHub cron |
| Showcase assets | Storage bucket `showcase` |

Public site reads: `src/lib/queries/blog.ts`, `portfolio.ts` via anon client (`src/lib/supabase.ts`).

## Secrets & deployment

Full secret placement table: [`docs/security.md`](security.md).

## UI zones (no mixing)

| Zone | Routes | Chrome |
|------|--------|--------|
| Site | all except below | PageLoader, Header, Footer, SiteBackground |
| Showcase | `/portfolio-showcase` | SpaceGallery only — no Header/Footer; consent modal still required |
| Portfolio grid | `/portfolio` | Normal site chrome — CMS grid + CTA to showcase |
| Admin | `/admin` | AdminShell |
| Legal | `/terms`, `/privacy`, `/cookies` | Header + Footer, no boot gate |

Consent: one `SiteConsentModal` (terms + privacy + cookies), not a separate cookie banner.

DOM = UI chrome; Canvas = 3D only (`src/components/three/**`). Showcase layout: `src/components/layout/AppChrome.tsx`.

## Deploy chain (single source of truth)

```
git push origin main
  ├── GitHub Actions CI (npm ci → check-env → lint → type-check → build)
  ├── Vercel production build (npm ci via vercel.json → npm run build)
  ├── Supabase DB Push (only if supabase/migrations/** changed)
  ├── Supabase Edge Functions deploy (only if supabase/functions/** changed)
  └── Upload Production Assets (only if public/** or asset scripts changed)
```

**Node.js:** `>=22` (`.nvmrc`, `package.json` engines, GitHub Actions, recommended for local dev).

**Do not** use Vercel CLI as primary deploy path. **Do not** force-push `main`.

Full platform audit and secret matrix: [`docs/INFRA-AUDIT-REPORT.md`](INFRA-AUDIT-REPORT.md) · [`docs/SECRETS-INVENTORY.md`](SECRETS-INVENTORY.md).

## Operational runbooks

| Task | How |
|------|-----|
| Verify all platforms green | Read `docs/INFRA-AUDIT-REPORT.md` §3 live snapshot; check GitHub Actions + Vercel dashboard |
| Sync Supabase migrations | `supabase migration list --linked` then `supabase db push --dry-run` |
| Deploy edge functions manually | GitHub → Actions → Deploy Supabase Edge Functions → Run workflow |
| Upload showcase/production assets | GitHub → Actions → Upload Production Assets (or `npm run sync:production-assets` locally with service role) |
| Keep Supabase awake | Automatic: `supabase-keep-alive.yml` every 5 min + CI keep-alive job on push |
| Sync admin inbox | GitHub → Actions → Admin Inbox Sync (manual — Hobby Vercel limits) |
| Fix Cloudflare email DNS | `docs/cloudflare-dns.md` + `scripts/fix-cloudflare-dns.sh` (DNS Edit token) |
| Check Cloudflare zone (read-only) | GitHub → Actions → Cloudflare DNS Check, or CI job on push if secrets set |

## Pre-push checklist

1. `npm ci && npm run check-env && npm run lint && npm run type-check && npm run build`
2. Test `/portfolio-showcase` on mobile + desktop (no spin, acceptable smoothness)
3. One focused commit; wait for GitHub CI green before calling production fixed

