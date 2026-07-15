# Cursor stack — Protos Web

Which Cursor plugins to enable or disable. Settings: **Cursor → Settings → Plugins / MCP**.

## ORM rules (Prisma, Convex) — NOT for this project

| What you see | Truth |
|--------------|-------|
| **Prisma plugin** `schema.prisma`, migrations, `prisma migrate` | Generic Cursor marketplace rules for **Prisma ORM** projects |
| **Convex plugin** `convex dev`, custom functions, RLS | Generic rules for **Convex backend** projects |

**Protos-Web never planned Prisma or Convex.** Backend is **Supabase only** (Postgres + RLS + Edge Functions). There is no `schema.prisma` and no `convex/` folder.

Those ORM rules **do not serve you** — they inject wrong patterns into every chat (`alwaysApply: true`). **Keep them disabled.** Canonical guardrails: `.cursor/rules/protos-web.mdc` + `docs/architecture.md`.

## Backend reminder

Removing Supabase jobs from `ci.yml` does **not** remove Supabase backend. Migrations/edge functions still deploy via dedicated GitHub workflows.

## Disable (noise / wrong stack)

| Plugin | Why |
|--------|-----|
| **Convex** | Wrong backend patterns |
| **Prisma** | Wrong ORM — no Prisma in repo |
| **Vercel** | Optional MCP for deploy logs — production deploy is **auto on `git push origin main`** |
| Firebase, Pinecone, Render | Not in stack |
| Datadog, Figma, Canva, Higgsfield, GSAP | Not used |

## Keep

| Plugin | Use |
|--------|-----|
| Supabase MCP (one instance) | Migrations, SQL, edge functions |
| Stripe, Sentry, Context7, Resend, shadcn | Stack-aligned |
| Cloudflare | DNS docs only |

## Docs in this repo (Cursor)

| File | Purpose |
|------|---------|
| `.cursor/rules/*.mdc` | Coding guardrails |
| `docs/architecture.md` | Product architecture |
| `PROJECT-MEMORY.md` | Stub — do not expand |

**Protos-Agent** = admin DeepSeek knowledge only (`/admin/memory`). Not part of Cursor workflow.

## Deploy chain (current)

```
git push origin main
  → ci.yml (lint + typecheck + build)
  → Vercel production deploy (Git integration)
  → supabase-db-push.yml (on migrations/**)
  → supabase-deploy-functions.yml (on functions/**)
  → supabase-keep-alive.yml (cron)
```

**Production deploy:** automatic on every push to `main`. Manual redeploy from Vercel Dashboard only if needed.

Cloudflare DNS: `cloudflare-dns-check.yml` (`workflow_dispatch`) only.

## Env / compatibility

- Required vars: `.env.example`
- Cross-browser: `docs/compatibility.md` — showcase has WebGL fallback + touch controls

## Canonical files in this repo

- `.cursor/rules/protos-web.mdc` — stack + repo roles
- `.cursor/rules/dom-canvas-layers.mdc` — 3D/UI layers
- `docs/architecture.md` — product architecture
- `PROJECT-MEMORY.md` — pointer only (not a memory dump)
