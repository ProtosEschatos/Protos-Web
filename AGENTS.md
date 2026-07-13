# Protos-Web — Agent Instructions

Live: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Admin UI: `docs/admin-console.md` + reference repo `Google-AI-Studio-Github-Connect`.
3. Full project memory: **Protos-Agent** repo `memory/projects/protos-web.md` — browse at `/admin/memory`.

## Stack

Next.js 14 App Router · TypeScript · Tailwind · next-intl (hr/en/de/it/es/sr) · Supabase · Vercel.

## Project layout

```
src/
├── app/[locale]/          # Public + admin routes
│   └── admin/stranice/    # Static page admin panels
├── components/
│   ├── features/          # admin/, home/sections/, blog/, portfolio/
│   ├── layout/            # Header, Footer, MobileMenu
│   ├── three/             # R3F backgrounds + showcase
│   └── ui/
├── lib/                   # auth, config, queries, routes, showcase
├── hooks/
└── types/
```

## Admin (`/admin`)

- Console v3.0 UI — `src/styles/admin-console.css` (`.admin-console` scope)
- Password auth via `ADMIN_SECRET` on **Vercel only**
- CMS: `src/lib/queries/admin/` reads · `src/actions/admin-*.ts` writes
- Inbox: Zoho IMAP + Martina (when `MARTINA_IMAP_*` set) — cached via cron `/api/cron/sync-inbox`
- Donations: Stripe LIVE · `/admin/donacije`
- AI: `/admin/ai` — DeepSeek via `DEEPSEEK_API_KEY`

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings

## Deploy

Push to `main` → Vercel production. Verify live after push (`vercel ls` or curl).

**Critical:** `ADMIN_SECRET` lives on Vercel only — git revert does **not** restore it.

## Current state (2026-07-13)

- **Latest commit:** `147ec2b` — middleware fix: `/api/*` routes work on production
- **Live:** https://www.protosweb.eu/admin
- **Inbox:** Zoho + Martina placeholder (no Gmail studio)
- **Docs:** `docs/admin-console.md`, `docs/stripe-donations.md`, `docs/security.md`
