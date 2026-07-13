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

## Repo root

**Jedan folder:** `~/Protos-Web` (git root, push na `main` → Vercel). Nema ugniježđenog `Protos-Web/Protos-Web`.

## Deploy

Push to `main` → Vercel production → https://www.protosweb.eu

Verify live after push: `curl -s -o /dev/null -w "%{http_code}" https://www.protosweb.eu/api/blog`

**Critical:** `ADMIN_SECRET` lives on Vercel only — git revert does **not** restore it.

## Current state (2026-07-13)

- **Latest commit:** `29e2873` — repo cleanup + middleware robots/sitemap fix
- **Live:** https://www.protosweb.eu — API, robots, sitemap, inbox cron OK
- **Inbox:** Zoho + Martina (no Gmail studio)
