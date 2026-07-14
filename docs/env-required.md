# Required environment variables

What breaks (or degrades) when a variable is missing. Canonical list: [`.env.example`](../.env.example) and [`security.md`](./security.md).

## Production — site breaks or is empty without these (Vercel)

| Variable | If missing |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` | `supabase` client is `null` — portfolio, blog, showcase frames **empty** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same — no public reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin CMS writes, inbox sync, server actions **fail** |
| `ADMIN_SECRET` | `/admin` login **disabled** (by design) |

## Production — optional (feature degrades)

| Variable | If missing |
|----------|------------|
| `GITHUB_TOKEN` | `/admin/memory` empty if Protos-Agent repo is private |
| `DEEPSEEK_API_KEY` / `GEMINI_API_KEY` | `/admin/ai` unavailable |
| `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` | Admin “Vercel status” card shows “Nije podešeno” |
| `CLOUDFLARE_*`, `SENTRY_*` | Admin insight cards show not configured |
| IMAP vars | `/admin/inbox` partial or empty |
| `CRON_SECRET` | `/api/cron/sync-inbox` rejects requests |

## GitHub Actions CI (build job)

| Secret | If missing |
|--------|------------|
| `SUPABASE_URL` | Build may fail or compile without live data |
| `SUPABASE_ANON_KEY` | Build step env incomplete |
| `SUPABASE_SERVICE_ROLE_KEY` | Server compile paths that need service role may fail |

Supabase **backend** deploy uses separate workflows (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `KEEP_ALIVE_SECRET`).

## Supabase Edge (not Vercel)

Stripe, Resend, Brevo, `KEEP_ALIVE_SECRET` — see `docs/security.md`.

## Local dev

Copy `.env.example` → `.env.local`. Minimum for full site:

```
NEXT_PUBLIC_SUPABASE_URL=https://laqnnzavwbojntfiqmxj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service role>
ADMIN_SECRET=<your password>
```

Run check: `npm run check:env` (validates required keys are set).
