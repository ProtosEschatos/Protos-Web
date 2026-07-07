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
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` | **Vercel** | Analytics / Search Console / error tracking |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_DONATION_*` | **Vercel** | Donations API (optional) |

**SEO-only Google account:** `protoswebmark23@gmail.com` — GA4 + Search Console only. Documented as `SEO_GOOGLE_EMAIL` in [`src/lib/site.ts`](../src/lib/site.ts). **Never** use for contact forms, Resend, Zoho, or public `CONTACT_EMAIL`.

**Do not put on Vercel:** `RESEND_API_KEY`, `BREVO_API_KEY`, `CONTACT_EMAIL`, `RESEND_FROM_EMAIL` — those belong in **Supabase Edge secrets** only. Contact email in UI comes from [`src/lib/site.ts`](../src/lib/site.ts), not Vercel env.

**Do not** store `ADMIN_SECRET` in Supabase — it is unused there and increases leak surface.

## Admin panel

- Password auth via `ADMIN_SECRET` on Vercel
- HttpOnly session cookie, `secure` in production
- Middleware blocks `/admin` without valid session
- Login rate limit: 5 attempts / 15 min per IP
- `robots.txt` disallows `/admin`
- Generic error messages on failed login (no hint whether secret is missing)

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
