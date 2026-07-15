# Protos-Web — Agent Instructions

Live: https://www.protosweb.eu · Repo: `ProtosEschatos/Protos-Web`

This repo is **production code only**. Cursor rules guard the codebase — they do not define the product.

## Before you work (this repo only)

1. `docs/security.md` — secrets (`ADMIN_SECRET` on Vercel only)
2. `docs/architecture.md` — stack, UI zones, backend
3. `.cursor/rules/protos-web.mdc` — coding guardrails

Do **not** pull Protos-Agent into Cursor sessions. That repo is for the **admin panel DeepSeek** feature only (`/admin/memory`, `/admin/ai`).

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

Admin panel (including DeepSeek + memory viewer): `docs/admin-console.md`
