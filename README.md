# Protos Web

Agency site — **https://protosweb.eu**

**Repo:** https://github.com/ProtosEschatos/Protos-Web  
**Deploy:** `git push origin main` → Vercel  
**Backend:** Supabase `laqnnzavwbojntfiqmxj`

## Stack

Next.js 16, React 19, TypeScript, Tailwind, Framer Motion, React Three Fiber, Lenis, next-intl 4.

**Jezici:** hr (default), en, de, it, es, sr

## Produkcija

| Što | Gdje |
|-----|------|
| Site | Vercel |
| DNS | Cloudflare |
| Baza, Storage, Edge Functions | Supabase |
| Inbox | Zoho `dario.admin@protosweb.eu` |
| Slanje maila | Resend + Brevo (Supabase Edge) |
| Donacije | Stripe (Supabase Edge) |
| Admin | https://www.protosweb.eu/admin |

## Env (Vercel)

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://protosweb.eu` |
| `NEXT_PUBLIC_SUPABASE_URL` | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | yes |
| `ADMIN_SECRET` | yes |

Ostalo (Stripe, Resend, IMAP, AI, …): vidi [`.env.example`](.env.example) i [`docs/security.md`](docs/security.md).

GitHub Actions secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `KEEP_ALIVE_SECRET`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`.

## Javne rute

`/`, `/o-meni`, `/proces`, `/portfolio`, `/portfolio-showcase`, `/usluge`, `/blog`, `/kontakt`, `/terms`, `/privacy`, `/cookies`

Admin: `/admin`, `/admin/inbox`, `/admin/donacije`, `/admin/blog`, `/admin/portfolio`, `/admin/subscribers`, `/admin/memory`, `/admin/ai`, `/admin/tools`

## Build (CI)

```bash
npm ci && npm run lint && npm run type-check && npm run build
```

## Dokumentacija

| Doc | Sadržaj |
|-----|---------|
| [`docs/security.md`](docs/security.md) | Gdje stoji svaki secret |
| [`docs/architecture.md`](docs/architecture.md) | Stack, Supabase, UI zone |
| [`docs/admin-console.md`](docs/admin-console.md) | Admin panel |
| [`docs/email-setup.md`](docs/email-setup.md) | Zoho + Resend + Brevo |
| [`docs/stripe-donations.md`](docs/stripe-donations.md) | Stripe donacije |
| [`docs/cloudflare-dns.md`](docs/cloudflare-dns.md) | DNS |
| [`supabase/functions/README.md`](supabase/functions/README.md) | Edge funkcije |
