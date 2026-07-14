# Cursor stack — Protos Web

Which Cursor plugins to enable or disable. Settings: **Cursor → Settings → Plugins / MCP**.

## ORM rules (Prisma, Convex) — NOT for this project

| What you see | Truth |
|--------------|-------|
| **Prisma plugin** `schema.prisma`, migrations, `prisma migrate` | Generic Cursor marketplace rules for **Prisma ORM** projects |
| **Convex plugin** `convex dev`, custom functions, RLS | Generic rules for **Convex backend** projects |

**Protos-Web never planned Prisma or Convex.** Backend is **Supabase only** (Postgres + RLS + Edge Functions). There is no `schema.prisma` and no `convex/` folder.

Those ORM rules **do not serve you** — they inject wrong patterns into every chat (`alwaysApply: true`). **Keep them disabled.** Canonical backend rules: `.cursor/rules/protos-web.mdc` + `docs/architecture.md`.

## Backend reminder

Removing Supabase jobs from `ci.yml` does **not** remove Supabase backend. Migrations/edge functions still deploy via dedicated GitHub workflows.

## Disable (noise / wrong stack)

| Plugin | Why |
|--------|-----|
| **Convex** | Wrong backend patterns |
| **Prisma** | Wrong ORM — no Prisma in repo |
| **Vercel** | User disabled — no auto-deploy, no CLI |
| Firebase, Pinecone, Render | Not in stack |
| Datadog, Figma, Canva, Higgsfield, GSAP | Not used |

## Keep

| Plugin | Use |
|--------|-----|
| **continual-learning** | Auto-updates `AGENTS.md` from chat (enable in Cursor Plugins) |
| Supabase MCP (one instance) | Migrations, SQL, edge functions |
| Stripe, Sentry, Context7, Resend, shadcn | Stack-aligned |
| Cloudflare | DNS docs only |

## Continual learning (memory)

1. Enable **continual-learning** plugin in Cursor → Settings → Plugins
2. Plugin runs `agents-memory-updater` on session end → updates `AGENTS.md` learned sections
3. Long-term memory also in **Protos-Agent** GitHub (`/admin/memory`)
4. Do not duplicate memory in random markdown files

## Deploy chain (current)

```
git push origin main
  → ci.yml (lint + typecheck + build) ONLY
  → Vercel auto-deploy OFF (vercel.json git.deploymentEnabled: false)
  → supabase-db-push.yml (on migrations/**)
  → supabase-deploy-functions.yml (on functions/**)
  → supabase-keep-alive.yml (cron)
```

**Production deploy:** manual from Vercel Dashboard when you choose — not on every push.

Cloudflare DNS: `cloudflare-dns-check.yml` (`workflow_dispatch`) only.

## Env / compatibility

- Required vars: `.env.example` — run `npm run check:env`
- Cross-browser: `docs/compatibility.md` — showcase has WebGL fallback + touch controls

## Canonical rules in repo

- `.cursor/rules/protos-web.mdc`
- `AGENTS.md`
- `docs/architecture.md`
