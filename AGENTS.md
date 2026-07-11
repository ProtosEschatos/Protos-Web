# Protos-Web — Agent Instructions

Live site: https://www.protosweb.eu  
Repo: ProtosEschatos/Protos-Web

## Before you work

1. Read `docs/security.md` for secret placement (never put `ADMIN_SECRET` in Supabase).
2. Site identity: `src/lib/site.ts` (`CONTACT_EMAIL`, `SITE_URL`, Supabase ref).
3. For full project memory see **Protos-Agent** repo: `memory/projects/protos-web.md`.

## Stack

Next.js 14 App Router · TypeScript · Tailwind · next-intl (hr/en/de/it/es) · Supabase · Vercel.

## Admin (`/admin`)

- Password auth via `ADMIN_SECRET` on **Vercel only**
- CMS writes need `SUPABASE_SERVICE_ROLE_KEY` on Vercel
- Admin UI uses `AdminShell` (bypasses boot veil) and `AdminLink` (not `@/routing` on server pages)
- CMS reads: `src/lib/admin/*-queries.ts` · writes: `src/actions/admin-*.ts`
- Social/platform structure: `src/lib/team-profiles.ts` (Studio/Dario/Martina + freelance); re-export via `social-links.ts` (`pending: true` until real URLs)
- Public tech stacks (no infra): `src/lib/tech-stacks.ts`

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings

## Deploy

Push to `main` → Vercel production. **After every push verify live** (`vercel ls` or curl) — GitHub green ≠ Vercel deployed; webhook can lag (use `vercel redeploy` if needed). Preview envs need same secrets as production for admin CMS.

**Critical:** `ADMIN_SECRET` lives on Vercel only — git revert does **not** restore it.

## Current state (2026-07-11)

- **Latest commit:** `1baa74d` — branding, dual stacks, SEO entities, blog `author_slug`
- **Live:** https://protosweb.eu (apex primary)
- Team roles + "Naša online prisutnost" in all 5 locales; Bodulica vanilla showcase on `/o-meni`
- SEO: AboutPage JSON-LD, person fragment IDs, blog byline + per-author JSON-LD, `llms.txt` updated
- Instagram live: studio/Dario `protos_eschatos`, Martina `everybodycries`; other socials `#` pending
- GitHub: branch protection on `main` (required CI check)
- Untracked (do not commit): `public/design/`
- Full memory: **Protos-Agent** `memory/projects/protos-web.md` + `memory/sessions/2026-07-11-branding-seo-stack.md`
