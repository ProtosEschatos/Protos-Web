# Protos-Web — Agent Instructions

Live site: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Site identity: `src/lib/config/site.ts` (`CONTACT_EMAIL`, `SITE_URL`, Supabase ref).
3. For full project memory see **Protos-Agent** repo: `memory/projects/protos-web.md`.
4. **Human UI:** browse memory at `/admin/memory` (read-only, loads from Protos-Agent GitHub).

## Stack

Next.js 14 App Router · TypeScript · Tailwind · next-intl (hr/en/de/it/es) · Supabase · Vercel.

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

- Password auth via `ADMIN_SECRET` on **Vercel only**
- CMS writes need `SUPABASE_SERVICE_ROLE_KEY` on Vercel
- Admin UI: `components/features/admin/` — `AdminShell`, `AdminSidebar`, `AdminLink`
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

## Current state (2026-07-11)

- **Latest commit:** `8f600e8` — refactor lib/features/queries, `admin/stranice/`, unified main nav
- **Live:** https://protosweb.eu (apex primary)
- **O nama hero:** "Protos Web — Full Stack Duo iz Zagreba." (all 5 locales)
- Team roles + "Naša online prisutnost" in all 5 locales; Bodulica vanilla showcase on `/o-meni`
- SEO: AboutPage JSON-LD, person fragment IDs, blog byline + per-author JSON-LD, `llms.txt` updated
- Instagram live: studio/Dario `protos_eschatos`, Martina `everybodycries`; other socials `#` pending
- **Zoho Mail:** inbox via DNS MX — no API key / env var needed
- **Stripe:** DB schema exists (`stripe_session_id`, `stripe_price_id`) — no app integration yet
- GitHub: branch protection on `main` (required CI check)
- Untracked (do not commit): `public/design/`
- Full memory: **Protos-Agent** `memory/projects/protos-web.md` + `memory/sessions/2026-07-11-branding-seo-stack.md`
