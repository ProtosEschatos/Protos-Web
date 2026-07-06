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
- Social/platform placeholders: `src/lib/social-links.ts` (`pending: true` until real URLs)

## Conventions

- Match existing component style and CSS variables
- Minimize diff scope; no drive-by refactors
- Only commit when the user asks
- Croatian copy for user-facing admin strings

## Deploy

Push to `main` → Vercel production. Preview envs need same secrets as production for admin CMS.
