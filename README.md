# Protos Web

Live: https://www.protosweb.eu

Agency website — Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Supabase, Vercel.

**Locales:** hr (default), en, de, it, es, sr

## Setup

```bash
npm install
cp .env.example .env.local   # fill in keys — never commit .env.local
npm run dev
```

```bash
npm run build
npm run type-check
```

## Docs

| Topic | File |
|-------|------|
| Agent / repo conventions | [`AGENTS.md`](AGENTS.md) |
| Secrets placement | [`docs/security.md`](docs/security.md) |
| Admin panel | [`docs/admin-console.md`](docs/admin-console.md) |
| Stripe donations | [`docs/stripe-donations.md`](docs/stripe-donations.md) |
| Supabase edge functions | [`supabase/functions/README.md`](supabase/functions/README.md) |

## Deploy

Push to `main` → Vercel production. GitHub Actions: CI, Supabase edge deploy, keep-alive, inbox sync.

Agent memory (canonical): [Protos-Agent](https://github.com/ProtosEschatos/Protos-Agent) — browse at `/admin/memory`.
