# Cursor stack — Protos Web

Which Cursor plugins to enable or disable for this repo. Settings: **Cursor → Settings → Plugins / MCP**.

## Backend reminder

**Supabase is the sole backend** (`laqnnzavwbojntfiqmxj`). Removing Supabase jobs from `ci.yml` does **not** remove Supabase — it only stops duplicate health checks in the build pipeline. Migrations and edge functions still deploy via dedicated GitHub workflows.

## Disable (noise / wrong stack)

| Plugin | Why |
|--------|-----|
| Convex | Pushes `convex dev` patterns — no `convex/` in this repo |
| Prisma | ORM rules — app uses Supabase, not Prisma |
| Firebase | Not in stack |
| Pinecone | Not in stack |
| Render | Deploy is GitHub → Vercel only |
| Datadog, Figma, Canva, Higgsfield, GSAP | Not used in Protos-Web |

## Keep

| Plugin | Use |
|--------|-----|
| Supabase MCP (one instance) | Migrations, SQL, edge functions |
| Stripe | Donations |
| Sentry | Error monitoring |
| Context7 | Library docs |
| Resend | Email docs |
| shadcn | UI reference (custom cosmic UI) |
| Cloudflare | DNS docs only — not a CI gate |

## Caution

| Plugin | Rule |
|--------|------|
| Vercel | Never `vercel deploy` CLI — only `git push origin main` |
| Supabase | Disable duplicate MCP if both `plugin-supabase` and `user-supabase` are active |

## Deploy chain

```
git push origin main
  → ci.yml (lint + typecheck + build)
  → Vercel production (GitHub integration)
  → supabase-db-push.yml (on migrations/**)
  → supabase-deploy-functions.yml (on functions/**)
  → supabase-keep-alive.yml (cron)
```

Cloudflare DNS: manual `cloudflare-dns-check.yml` (`workflow_dispatch`) — never blocks merge.

## Canonical rules in repo

- `.cursor/rules/protos-web.mdc` — single rule file
- `AGENTS.md` — agent instructions
- `docs/architecture.md` — stack map
