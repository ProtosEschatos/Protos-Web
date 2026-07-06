# Supabase Edge Functions

Project ref: `laqnnzavwbojntfiqmxj`

| Function | Trigger | Purpose |
|----------|---------|---------|
| `keep-alive` | GitHub cron (`supabase-keep-alive.yml`) | Ping DB to prevent free-tier pause |
| `submit-form` | Database webhook on `contacts` INSERT | Admin + auto-reply emails (Resend/Brevo) |
| `subscribe` | `POST /api/subscribe` from site footer | Newsletter signup + welcome email |
| `content` | `GET ?type=<t>&lang=<l>` (service role) | Generic read API for DB-backed content (services, portfolio, blog, testimonials, pricing, process) |

## Deploy

Functions deploy automatically via [`.github/workflows/supabase-deploy-functions.yml`](../../.github/workflows/supabase-deploy-functions.yml) when `supabase/functions/**` changes on `main`.

`submit-form` and `subscribe` are deployed with `--no-verify-jwt` (DB webhook and public API callers).

## Resend domain (protosweb.eu)

Zoho Mail receives at `dario.admin@protosweb.eu`. Resend sends transactional mail from the same domain.

DNS records already present (check Resend dashboard for verification status):

| Record | Purpose |
|--------|---------|
| `send.protosweb.eu` TXT SPF | Resend sending (`include:amazonses.com`) |
| `resend._domainkey.protosweb.eu` TXT | DKIM |
| `_dmarc.protosweb.eu` TXT | DMARC — update `rua` to `dario.admin@protosweb.eu` if still pointing at old domain |

Zoho MX records for receiving mail must remain alongside Resend records.

Required GitHub secrets:

- `SUPABASE_ACCESS_TOKEN` — personal access token with deploy rights
- `SUPABASE_PROJECT_REF` — `laqnnzavwbojntfiqmxj`

## Supabase Edge Function secrets

Set in Supabase Dashboard → Edge Functions → Secrets:

| Secret | Used by |
|--------|---------|
| `KEEP_ALIVE_SECRET` | `keep-alive` |
| `SUPABASE_URL` | all |
| `SUPABASE_SERVICE_ROLE_KEY` | `subscribe`, `keep-alive`, `content` |
| `RESEND_API_KEY` | `submit-form`, `subscribe` |
| `RESEND_FROM_EMAIL` | `submit-form`, `subscribe` — `dario.admin@protosweb.eu` |
| `CONTACT_EMAIL` | `submit-form` — admin inbox `dario.admin@protosweb.eu` |
| `BREVO_API_KEY` | `submit-form` (optional fallback) |

## Contact form → email (database webhook)

The Next.js contact form writes to `contacts` via RPC `submit_contact`. Emails are sent by `submit-form` through a **Database Webhook** (not from Next.js).

Configure once in Supabase Dashboard → Database → Webhooks:

1. **Name:** `contacts-insert-submit-form`
2. **Table:** `public.contacts`
3. **Events:** `INSERT`
4. **Type:** Supabase Edge Function
5. **Function:** `submit-form`

Or HTTP URL:

`https://laqnnzavwbojntfiqmxj.supabase.co/functions/v1/submit-form`

The function accepts webhook payloads only (`body.type === 'INSERT' && body.record`).
