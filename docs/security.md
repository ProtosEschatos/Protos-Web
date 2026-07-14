# Security — Protos Web

Practical security map for `protosweb.eu`. No system is immune to every attack; this documents what we enforce in code and where secrets live.

## Secret placement

| Secret | Platform | Used by |
|--------|----------|---------|
| `ADMIN_SECRET` | **Vercel only** | `/admin` login + middleware (Next.js) |
| `RESEND_API_KEY`, `BREVO_API_KEY` | **Supabase Edge secrets** | `submit-form`, `subscribe` |
| `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` | **Supabase Edge secrets** | Email from addresses |
| `KEEP_ALIVE_SECRET` | **Supabase** + **GitHub** | `keep-alive` edge fn + cron |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Vercel** | Client → Supabase (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel** (server) + **GitHub** | Server actions / CI only — never expose to browser |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` | **GitHub** | Deploy edge functions on push |
| `GITHUB_TOKEN` | **Vercel** (optional) | `/admin/memory` — **required** if Protos-Agent repo is private |
| `DEEPSEEK_API_KEY` | **Vercel** | `/admin/ai` — DeepSeek chat (već postavljen) |
| `GEMINI_API_KEY` | **Vercel** (optional) | `/admin/ai` — alternativni provider |
| `AGENT_MEMORY_REPO` | **Vercel** (optional) | Default `ProtosEschatos/Protos-Agent` — override repo for memory fetch |

### Email — multi-mailbox IMAP (admin only)

**Zoho** receives at `dario.admin@protosweb.eu` via DNS MX. The admin panel reads mail through **IMAP** at `/admin/inbox` — not Zoho webmail.

| Service | Secret location | Notes |
|---------|-----------------|-------|
| **Zoho IMAP (Dario)** | **Vercel** | `ZOHO_IMAP_USER`, `ZOHO_IMAP_PASSWORD` — enable IMAP Access in Zoho |
| **Resend** | Supabase Edge | Outbound transactional mail (`submit-form`, `subscribe`) |
| **Brevo** | Supabase Edge | Optional; DKIM on apex for deliverability |

### Stripe — donations (Supabase Edge)

`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` live in **Supabase Edge secrets** only. Webhook URL: `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook` (exact ref in the Supabase dashboard). See [stripe-donations.md](./stripe-donations.md).

Legacy multi-tenant columns may still exist elsewhere; active flow uses `donations` table + edge fn `donation-checkout` / `stripe-webhook`.

**Do not** store `ADMIN_SECRET` in Supabase — it is unused there and increases leak surface. Remove it from Supabase Dashboard → Edge Functions → Secrets if present.

## GitHub Actions secrets

| Secret | Required for | Notes |
|--------|--------------|-------|
| `SUPABASE_URL` | `ci.yml` build | Same as `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | `ci.yml` build | Publishable anon key for Next.js compile |
| `SUPABASE_SERVICE_ROLE_KEY` | `ci.yml` build | Server-side compile only — never in browser |
| `SUPABASE_ACCESS_TOKEN` | `supabase-db-push.yml`, `supabase-deploy-functions.yml` | CLI deploy |
| `SUPABASE_PROJECT_REF` | Supabase workflows | `laqnnzavwbojntfiqmxj` |
| `KEEP_ALIVE_SECRET` | `supabase-keep-alive.yml` | Edge fn auth |
| `CLOUDFLARE_API_TOKEN` | `cloudflare-dns-check.yml` (manual only) | Optional — DNS check, not CI gate |
| `CLOUDFLARE_ZONE_ID` | `cloudflare-dns-check.yml` (manual only) | Optional |

**Not in `ci.yml`:** Supabase keep-alive and REST probes run in dedicated workflows (`supabase-keep-alive.yml`, `supabase-db-push.yml`). Cloudflare is DNS-only — see [cloudflare-dns.md](./cloudflare-dns.md).

Cursor plugin allowlist: [cursor-stack.md](./cursor-stack.md).

**Vercel auto-deploy:** disabled in `vercel.json` — push does not trigger production build.

## Admin panel

- Password auth via `ADMIN_SECRET` on Vercel
- HttpOnly session cookie, `secure` in production
- Middleware blocks `/admin` without valid session
- Login rate limit: 5 attempts / 15 min per IP
- `robots.txt` disallows `/admin`
- Generic error messages on failed login (no hint whether secret is missing)
- `/admin/memory` is admin-only; fetches public markdown from Protos-Agent (no secrets in content)

Admin UI layout and Console v3.0 reference: [admin-console.md](./admin-console.md).

## Supabase / data

- RLS enabled on sensitive tables; newsletter inserts via edge fn (not open anon INSERT)
- Contact form uses RPC `submit_contact` + webhook → edge fn
- Design library (`design_elements`) — service role only
- Showcase bucket: public object URLs only (no bucket listing policy)

## HTTP headers (Next.js)

Set in `next.config.js`: HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, moderate CSP.

## If a key was exposed in chat or logs

1. Rotate the key immediately (Resend, Brevo, Cloudflare, Supabase, Vercel, `ADMIN_SECRET`)
2. Update the correct platform only (see table above)
3. Redeploy Vercel / redeploy edge functions if Supabase secrets changed

## Account hygiene (manual)

- Enable 2FA on Vercel, GitHub, Supabase, Cloudflare, Zoho
- Use strong unique `ADMIN_SECRET` (20+ chars)
- Cloudflare WAF / DNS — see [cloudflare-dns.md](./cloudflare-dns.md)
- Publish `/.well-known/security.txt` (see `public/.well-known/security.txt`)
