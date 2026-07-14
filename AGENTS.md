# Protos-Web — Agent Instructions

Live site: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Admin UI: `docs/admin-console.md` + reference repo `Google-AI-Studio-Github-Connect`.
3. Full project memory: **Protos-Agent** `memory/projects/protos-web.md` (not `PROJECT-MEMORY.md` — that file is TL;DR only).
4. Human UI: browse memory at `/admin/memory` (read-only, loads from Protos-Agent GitHub).
5. Cursor rules: `.cursor/rules/*.mdc` (showcase layers, fix-not-remove, design system).

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind · next-intl (hr/en/de/it/es/sr) · Supabase · Vercel.

## Project layout

```
src/
├── app/[locale]/          # Public + admin routes
│   └── admin/stranice/    # Static page admin panels (o-meni, proces, usluge)
├── components/
│   ├── features/          # admin/, home/sections/, blog/, portfolio/
│   ├── layout/            # Header, Footer, MobileMenu
│   ├── three/             # R3F backgrounds + showcase (SpaceGallery)
│   └── ui/
├── lib/
│   ├── auth/              # admin auth, rate limit, require-admin
│   ├── config/            # site, seo, admin-links, social-links, tech-stacks
│   ├── queries/           # blog, portfolio (+ admin/)
│   ├── routes/            # main-nav.ts
│   └── showcase/          # showcase storage, webgl helpers
├── hooks/                 # use-showcase-viewport.ts
└── types/                 # blog.ts, portfolio.ts
```

## Admin (`/admin`)

- Console v3.0 UI — ref: `Google-AI-Studio-Github-Connect`; docs: `docs/admin-console.md`
- Password auth via `ADMIN_SECRET` on **Vercel only**
- CMS reads: `src/lib/queries/admin/` · writes: `src/actions/admin-*.ts`
- Agent memory: `/admin/memory` — Protos-Agent via GitHub raw
- AI assistant: `/admin/ai` — `DEEPSEEK_API_KEY` on Vercel

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings
- **Fix, don't remove** broken features (see `.cursor/rules/fix-not-remove.mdc`)

## Showcase (`/portfolio-showcase`)

- No Header/Footer/SiteBackground — handled in `AppChrome`
- `PortfolioShowcaseClient` → dynamic `SpaceGallery` with `ShowcaseBootLoader` (never `loading: () => null`)
- Phases: `loading` | `intro` | `playing` — one visible at a time

## Deploy

**GitHub only:** push to `main` → Vercel production auto-deploy.

- Do **not** use Vercel CLI (`vercel deploy`, `vercel ls`, `vercel redeploy`) or custom deploy scripts
- After push, verify live: `curl -sS -o /dev/null -w "%{http_code}" https://www.protosweb.eu/portfolio-showcase`
- GitHub CI green ≠ instant Vercel READY — wait for deploy, then curl

**Critical:** `ADMIN_SECRET` lives on Vercel only — git revert does **not** restore it.

## Current state (2026-07-14)

- **Latest commit:** `40b0514` — showcase boot loader restored
- **Supabase:** `laqnnzavwbojntfiqmxj` — blog/portfolio/contact live
- **Donacije:** Stripe LIVE · `/admin/donacije`
- Full session history: **Protos-Agent** `memory/sessions/`
