# Protos Web

Next.js 16 · React 19 · TypeScript · Tailwind · Supabase.

Agency site — `protosweb.eu`.

## Dev

```bash
nvm use            # Node 22 (see .nvmrc)
npm ci
cp .env.example .env.local   # fill in the required Supabase vars
npm run dev
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run check-env` | Verify required env vars are set |

Asset / showcase scripts live under `scripts/` — see `package.json`.

## Docs

- `docs/architecture.md` — stack layout
- `docs/security.md` · `public/.well-known/security.txt` — security policy
- `docs/email-setup.md` — Zoho / Resend / Brevo wiring
- `docs/stripe-donations.md` — donations flow
- `docs/cloudflare-dns.md` — DNS notes
- `docs/admin-console.md` — `/admin` overview

## Backend

Supabase project `laqnnzavwbojntfiqmxj`. Migrations in `supabase/migrations/`, Edge Functions in `supabase/functions/`.
