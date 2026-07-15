# API ownership — Next.js routes vs Supabase Edge Functions

Single source of truth for where backend logic lives. Next.js API routes are **thin adapters** (validation, rate limits, locale URLs); Supabase Edge Functions own secrets and side effects (email, Stripe, service-role DB writes).

## Public site flows

| User action | Next.js route | Owner of business logic | Notes |
|-------------|---------------|-------------------------|-------|
| Contact form | `POST /api/contact` | **Supabase RPC** `submit_contact` + Edge `submit-form` | Route persists via anon client; email sent by DB webhook on `contacts` INSERT — not from Next.js |
| Newsletter | `POST /api/subscribe` | Edge **`subscribe`** | Route proxies via `invokeEdgeFunction`; Brevo/Resend secrets on Supabase only |
| Donation checkout | `POST /api/donate` | Edge **`donation-checkout`** | Route validates amount/cause and builds localized success/cancel URLs, then proxies |
| Donation confirm (return URL) | `POST /api/donate/confirm` | Edge **`donation-confirm`** | Route validates `cs_` session id, then proxies |
| Blog JSON | `GET /api/blog` | **Next.js** (`getBlogPosts`) | Read-only anon query; no edge fn |

## Supabase-only (no Next.js duplicate)

| Function | Trigger | Purpose |
|----------|---------|---------|
| `submit-form` | Database webhook on `contacts` INSERT | Contact admin + auto-reply email (Resend → Brevo fallback) |
| `subscribe` | `POST /api/subscribe` | Upsert subscriber + welcome/admin email |
| `donation-checkout` | `POST /api/donate` | Insert pending `donations` row + Stripe Checkout session |
| `donation-confirm` | `POST /api/donate/confirm` | Poll Stripe session, mark donation completed |
| `stripe-webhook` | Stripe webhook | `checkout.session.completed` / `expired` → update `donations` |
| `keep-alive` | GitHub cron | Ping DB (free-tier keep-alive) |

## Next.js-only (Node runtime)

| Route | Purpose | Why not Edge |
|-------|---------|--------------|
| `POST /api/admin/login` | Admin session cookie | `crypto` + `ADMIN_SECRET` on Vercel |
| `POST /api/admin/logout` | Clear admin cookie | Same |
| `GET /api/admin/session` | Session probe | Same |
| `GET /api/admin/notifications/badge` | Admin badge count | Server actions + cookie auth |
| `POST /api/admin/ai` | Admin AI providers | Node provider adapters |
| `GET /api/cron/sync-inbox` | IMAP → Supabase cache | **imapflow** — Node only |

## Shared helpers

| Module | Role |
|--------|------|
| `src/lib/supabase/edge-fn.ts` | `invokeEdgeFunction()` — anon-key proxy to `/functions/v1/*` |
| `src/lib/contact/submit-contact.ts` | Contact RPC wrapper (used by `/api/contact` only) |
| `src/lib/security/rate-limit.ts` | In-memory rate limits on public POST routes |

## Rules

1. **Never duplicate** Stripe, Resend, or Brevo calls in Next.js — those secrets stay on Supabase Edge.
2. **Contact email** is always webhook-driven (`submit-form`); the contact route only writes to Postgres.
3. **Donate/subscribe** Next routes must use `invokeEdgeFunction`, not inline `fetch` to Supabase.
4. **IMAP / admin auth** stay in Node routes and `server-only` mail modules — never import from `src/proxy.ts` or edge middleware.

See also: [`architecture.md`](./architecture.md), [`supabase/functions/README.md`](../supabase/functions/README.md), [`security.md`](./security.md).
