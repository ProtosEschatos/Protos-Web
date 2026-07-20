# API ownership — Protos Web

Single source of truth per flow. Next.js API routes are thin proxies (validation + rate limit); business logic lives in Supabase (RPC, Edge Functions, or Postgres triggers/webhooks).

## Public form flows

| Route | Owner | Runtime | Next.js role | External deps |
|-------|-------|---------|--------------|---------------|
| `POST /api/contact` | Supabase RPC `submit_contact` + Edge `submit-form` (DB webhook) | nodejs | Rate limit, validate, call RPC | Supabase anon client |
| `POST /api/subscribe` | Edge `subscribe` | nodejs | Rate limit, validate, proxy | Supabase Edge (Resend/Brevo) |
| `POST /api/donate` | Edge `donation-checkout` | nodejs | Rate limit, validate, build URLs, proxy | Supabase Edge (Stripe) |
| `POST /api/donate/confirm` | Edge `donation-confirm` | nodejs | Rate limit, validate session id, proxy | Supabase Edge (Stripe) |

### Contact flow detail

1. Browser → `POST /api/contact` (Next.js)
2. Next.js → `submit_contact` RPC (writes `contacts` row, DB rate limit)
3. Postgres trigger/webhook → Edge `submit-form` (Resend/Brevo email)

Email is **never** sent from Next.js. Do not proxy contact directly to `submit-form` — that function expects DB webhook payloads only.

### Donation / Stripe

Stripe keys live on **Supabase Edge secrets**, not Vercel. Webhook handler: Edge `stripe-webhook` (called by Stripe, not Next.js).

## Next.js–only routes

| Route | Owner | Runtime | Purpose | External deps |
|-------|-------|---------|---------|---------------|
| `GET /api/cron/sync-inbox` | Next.js | nodejs | IMAP sync → Supabase `admin_mail_sync` cache | imapflow, Zoho IMAP |
| `POST /api/admin/login` | Next.js | nodejs | `ADMIN_SECRET` session cookie | — |
| `GET /api/admin/session` | Next.js | nodejs | Session check | — |
| `POST /api/admin/logout` | Next.js | nodejs | Clear session | — |
| `POST /api/admin/ai` | Next.js | nodejs | Admin AI assistant | GPT-OSS-120B (primary), DeepSeek, Gemini (cascade) |
| `GET /api/admin/notifications/badge` | Next.js | nodejs | Admin badge count | Supabase service role |
| `GET /api/blog` | Next.js | nodejs | Public blog JSON | Supabase anon |
| `GET /api/og` | Next.js | **edge** | Dynamic OG images | — |

## Supabase Edge Functions (no Next.js duplicate)

| Function | Trigger | Purpose |
|----------|---------|---------|
| `submit-form` | DB webhook on `contacts` INSERT | Contact notification + auto-reply email |
| `subscribe` | Next.js proxy or direct | Subscriber upsert + welcome email |
| `donation-checkout` | Next.js proxy | Stripe Checkout session |
| `donation-confirm` | Next.js proxy | Post-checkout confirmation |
| `stripe-webhook` | Stripe webhook | Payment events |
| `keep-alive` | GitHub cron | Prevent Supabase pause |

## Edge proxy (`src/proxy.ts`)

| Concern | Owner | Runtime | Imports |
|---------|-------|---------|---------|
| i18n routing, admin gate | Next.js edge proxy | edge | `next-intl`, `admin-auth-shared` (Web Crypto HMAC only) |

**Must not import:** `mail/`, `imapflow`, `admin-auth` (Node `crypto`), or any `server-only` module.

## Shared helpers

| Module | Used by |
|--------|---------|
| `src/lib/supabase/edge-fn.ts` | subscribe, donate, donate/confirm routes |
| `src/lib/contact/submit-contact.ts` | contact route (RPC only) |
| `src/lib/security/rate-limit.ts` | Public API routes |

See also: [`docs/architecture.md`](architecture.md), [`docs/security.md`](security.md), [`supabase/functions/README.md`](../supabase/functions/README.md).
