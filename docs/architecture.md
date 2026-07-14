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

There is no Prisma, Firebase, or separate Node API server. Next.js API routes call Supabase (anon or service role) or Supabase Edge Functions.

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
| Showcase | `/portfolio-showcase` | SpaceGallery only — no site chrome |
| Admin | `/admin` | AdminShell |
| Legal | `/terms`, `/privacy`, `/cookies` | Header + Footer, no boot gate |

Consent: one `SiteConsentModal` (terms + privacy + cookies), not a separate cookie banner.

DOM = UI chrome; Canvas = 3D only (`src/components/three/**`). See [`.cursor/rules/protos-web.mdc`](../.cursor/rules/protos-web.mdc).
