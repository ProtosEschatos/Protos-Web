# Protos-Web — Agent Instructions

Live site: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Admin UI: `docs/admin-console.md` + reference repo `Google-AI-Studio-Github-Connect`.
3. Full project memory: **Protos-Agent** `memory/projects/protos-web.md` (not `PROJECT-MEMORY.md` — that file is TL;DR only).
4. Human UI: browse memory at `/admin/memory` (read-only, loads from Protos-Agent GitHub).
5. Cursor rules: `.cursor/rules/protos-web.mdc` (single canonical rule file).
6. Architecture + Supabase backend map: `docs/architecture.md`.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind · next-intl (hr/en/de/it/es/sr) · **Supabase (sole backend)** · Vercel.

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
│   ├── config/            # site, seo, admin-links, team-profiles, tech-stacks
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
- Agent memory: `/admin/memory` — Protos-Agent via GitHub only
- AI assistant: `/admin/ai` — `DEEPSEEK_API_KEY` on Vercel

## Supabase

- Project: `laqnnzavwbojntfiqmxj`
- Migrations: `supabase/migrations/` → GitHub Actions **Supabase DB Push** (`supabase db push` on push to `main`)
- Edge functions: `.github/workflows/supabase-deploy-functions.yml` on `supabase/functions/**`
- Keep-alive: `.github/workflows/supabase-keep-alive.yml` (every 5 min)

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings
- Fix, don't remove broken user-facing features without explicit approval

## Showcase (`/portfolio`)

3D space gallery — same URL as nav **Portfolio**. Legacy `/portfolio-showcase` redirects here.

- No Header/Footer/SiteBackground — handled in `AppChrome`
- `PortfolioShowcaseClient` → dynamic `SpaceGallery` with `ShowcaseBootLoader` (never `loading: () => null`)
- `ShowcaseBootBypass` in layout — hides site boot veil; never stack PageLoader on showcase
- `ShowcasePrefetchLink` on entry CTAs — prefetches SpaceGallery chunk on hover/focus
- Phases: `loading` | `intro` | `playing` — one visible at a time; canvas `onReady` → intro

## Deploy

**Git push → Vercel production build** (auto-deploy uključen). Ne koristi Vercel CLI za deploy.
- Deploy production **manually** from Vercel Dashboard when ready
- **Supabase backend** — dedicated GitHub workflows (not removed from `ci.yml` = backend removed; only duplicate health jobs removed)
- Cloudflare DNS: manual `cloudflare-dns-check.yml` only
- Cursor plugins: `docs/cursor-stack.md` — **disable Prisma, Convex, Vercel plugins**
- Env check: `npm run check:env` — see `.env.example`
- Compatibility: `docs/compatibility.md` — all devices/browsers; showcase WebGL fallback

**Critical:** `ADMIN_SECRET` on Vercel only — git revert does not restore it.

## Agent memory loop

- Enable Cursor **continual-learning** plugin — updates learned sections in this file after sessions
- Canonical long-term memory: **Protos-Agent** GitHub (`memory/projects/protos-web.md`)
- `/admin/memory` — read-only UI

## Learned User Preferences

- Never Vercel CLI deploy; auto-deploy on git push must stay off
- Supabase is the sole backend — never suggest Convex, Prisma, or Firebase as backend
- Disable Convex/Prisma/Vercel Cursor plugins — they add wrong ORM/backend rules
- Do not touch `.env*` unless explicitly asked
- When fixing: delete old duplicates, do not stack new files/rules on top
- Croatian copy for admin-facing strings
- Site must work on all common devices, OS, and browsers without debate
- Commit only when user asks

## Learned Workspace Facts

- Supabase project: `laqnnzavwbojntfiqmxj` — 24 migrations synced
- CI `ci.yml`: build job only (lint + typecheck + build)
- Agent memory fetch: GitHub `ProtosEschatos/Protos-Agent` only — no local path fallback
- Showcase: `ShowcaseBootBypass` + `ShowcasePrefetchLink` — no site boot veil on entry
- Missing Supabase env vars → empty data, not crash — see `.env.example`

## Current state (2026-07-15)

- **Supabase:** `laqnnzavwbojntfiqmxj` — 24 migrations synced (repo + remote)
- **Donacije:** Stripe LIVE · `/admin/donacije`
- **Vercel:** auto-deploy disabled in repo config
- Full session history: **Protos-Agent** `memory/sessions/`
