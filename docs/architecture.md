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

## What Vercel owns

| Concern | Env |
|---------|-----|
| Next.js runtime | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Admin login | `ADMIN_SECRET` |
| AI assistant | `DEEPSEEK_API_KEY` |
| IMAP inboxes | `ZOHO_IMAP_*`, `GMAIL_STUDIO_IMAP_*` |
| Agent memory | `GITHUB_TOKEN` (if Protos-Agent private) |

## Local `.env.local` (required for dev)

Copy from [`.env.example`](../.env.example). Minimum:

```
NEXT_PUBLIC_SUPABASE_URL=https://laqnnzavwbojntfiqmxj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Dashboard → Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<service_role key — same dashboard>
ADMIN_SECRET=<your admin password>
NEXT_PUBLIC_SITE_URL=https://protosweb.eu
```

- **No quotes** around JWT values.
- Rotate keys in Dashboard if REST returns `401 Invalid API key`.
- Do **not** put `STRIPE_SECRET_KEY` in `.env.local` for Next — donations use Supabase Edge.
- If `.env.local` contains `VERCEL_*` / `TURBO_*` from `vercel env pull`, that is fine for local preview but not required; Supabase keys must still be valid.

## UI zones (no mixing)

| Zone | Routes | Chrome |
|------|--------|--------|
| Site | all except below | PageLoader, Header, Footer, SiteBackground |
| Showcase | `/portfolio-showcase` | SpaceGallery only — no site chrome |
| Admin | `/admin` | AdminShell |
| Legal | `/terms`, `/privacy`, `/cookies` | Header + Footer, no boot gate |

Consent: one `SiteConsentModal` (terms + privacy + cookies), not a separate cookie banner.

See [`.cursor/rules/dom-canvas-layers.mdc`](../.cursor/rules/dom-canvas-layers.mdc).

## Secret map

Full table: [`docs/security.md`](security.md).
