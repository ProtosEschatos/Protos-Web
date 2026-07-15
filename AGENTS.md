# Protos-Web — Agent Instructions

Live: https://www.protosweb.eu · Repo: `ProtosEschatos/Protos-Web`

## Repo roles

| Repo | Purpose |
|------|---------|
| **Protos-Web** (this) | Production site — code, Supabase, CI, Vercel |
| **Protos-Agent** | Long-term memory, sessions, plans — **canonical source** |

**Workflow drives rules, not the reverse.** Do not bulk-rewrite docs/rules. Do not store session logs or checklists in this repo.

## Before you work

1. `docs/security.md` — secrets (`ADMIN_SECRET` on Vercel only)
2. `docs/architecture.md` — stack, UI zones, backend
3. `.cursor/rules/protos-web.mdc` — coding guardrails
4. Memory: **Protos-Agent** `memory/projects/protos-web.md` · UI: `/admin/memory`

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind · next-intl (hr/en/de/it/es/sr) · Supabase only · Vercel.

## Deploy

`git push origin main` → GitHub CI + Vercel production. Never Vercel CLI.

## Conventions

- Minimize diff scope; match existing style
- Fix, don't remove features without explicit approval
- Only commit when the user asks
- Do not touch `.env*` unless explicitly asked
- Croatian copy for admin-facing strings

Details: `docs/admin-console.md`, `docs/cursor-stack.md`
