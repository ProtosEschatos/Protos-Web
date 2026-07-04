# Supabase Edge Functions

Project ref: `laqnnzavwbojntfiqmxj`

| Function | Trigger | Purpose |
|----------|---------|---------|
| `keep-alive` | GitHub cron (`supabase-keep-alive.yml`) | Ping DB to prevent free-tier pause |
| `submit-form` | Database webhook on `contacts` INSERT | Admin + auto-reply emails (Resend/Brevo) |
| `subscribe` | `POST /api/subscribe` from site footer | Newsletter signup + welcome email |

## Deploy

Functions deploy automatically via [`.github/workflows/supabase-deploy-functions.yml`](../../.github/workflows/supabase-deploy-functions.yml) when `supabase/functions/**` changes on `main`.

Required GitHub secrets:

- `SUPABASE_ACCESS_TOKEN` — personal access token with deploy rights
- `SUPABASE_PROJECT_REF` — `laqnnzavwbojntfiqmxj`

## Supabase Edge Function secrets

Set in Supabase Dashboard → Edge Functions → Secrets:

| Secret | Used by |
|--------|---------|
| `KEEP_ALIVE_SECRET` | `keep-alive` |
| `SUPABASE_URL` | all |
| `SUPABASE_SERVICE_ROLE_KEY` | `subscribe`, `keep-alive` |
| `RESEND_API_KEY` | `submit-form`, `subscribe` |
| `RESEND_FROM_EMAIL` | `submit-form` |
| `CONTACT_EMAIL` | `submit-form` |
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
