# Protos-Web — Agent Instructions

Live site: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Admin UI: `docs/admin-console.md` + reference repo `Google-AI-Studio-Github-Connect`.
3. For full project memory see **Protos-Agent** repo: `memory/projects/protos-web.md`.
4. **Human UI:** browse memory at `/admin/memory` (read-only, loads from Protos-Agent GitHub).

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind · next-intl (hr/en/de/it/es/sr) · Supabase · Vercel.

## Project layout (post-refactor)

```
src/
├── app/[locale]/          # Public + admin routes (App Router only)
│   └── admin/stranice/    # Static page admin panels (o-meni, proces, usluge)
├── components/
│   ├── features/          # admin/, home/sections/, blog/, portfolio/
│   ├── layout/            # Header, Footer, MobileMenu
│   ├── three/             # R3F backgrounds + showcase
│   └── ui/                # shared UI + section-icons.tsx
├── lib/
│   ├── auth/              # admin auth, rate limit, require-admin
│   ├── config/            # site, seo, admin-links, social-links, tech-stacks
│   ├── queries/           # blog, portfolio (+ admin/ subfolder)
│   ├── routes/            # main-nav.ts
│   └── showcase/          # showcase storage, webgl helpers
├── hooks/                 # use-showcase-viewport.ts
└── types/                 # blog.ts, portfolio.ts
```

## Admin (`/admin`)

- **Console v3.0** UI — referenca: `ProtosEschatos/Google-AI-Studio-Github-Connect`; docs: `docs/admin-console.md`
- Password auth via `ADMIN_SECRET` on **Vercel only**
- Stil: `src/styles/admin-console.css` (`.admin-console` scope)
- Admin UI: `AdminShell`, `AdminSidebar`, `AdminLink` (Next.js client nav)
- CMS reads: `src/lib/queries/admin/` · writes: `src/actions/admin-*.ts`
- Static pages: `/admin/stranice/*` (copy in `messages/*.json` + page components)
- Agent memory: `/admin/memory` — reads `Protos-Agent/memory/` via GitHub raw
- AI assistant: `/admin/ai` — DeepSeek (+ opcionalno Gemini) via `DEEPSEEK_API_KEY` on Vercel
- External tools: `/admin/tools` — Zoho/Resend/Brevo links (`src/lib/config/admin-links.ts`)
- Social/platform structure: `src/lib/config/team-profiles.ts`; re-export via `social-links.ts` (`pending: true` until real URLs)
- Public tech stacks (no infra): `src/lib/config/tech-stacks.ts`
- Main nav (public + admin): `src/lib/routes/main-nav.ts`

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings

## Deploy

Push to `main` → Vercel production. **After every push verify live** (`vercel ls` or curl) — GitHub green ≠ Vercel deployed; webhook can lag (use `vercel redeploy` if needed). Preview envs need same secrets as production for admin CMS.

**Critical:** `ADMIN_SECRET` lives on Vercel only — git revert does **not** restore it.

## Current state (2026-07-15)

- **Stable codebase:** reverted to 2026-07-13 baseline + CI fixes on `main`
- **Live:** https://www.protosweb.eu · showcase route: `/hr/portfolio-showcase`
- **Rules:** `.cursorrules`, `.cursor/rules/protos-web.mdc`, `docs/architecture.md`
- **Donacije:** Stripe LIVE · `/admin/donacije`
- Full memory: **Protos-Agent** `memory/projects/protos-web.md`
