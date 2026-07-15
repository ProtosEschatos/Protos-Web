# Migrations

Project: `laqnnzavwbojntfiqmxj`  
Dashboard: [Database → Migrations](https://supabase.com/dashboard/project/laqnnzavwbojntfiqmxj/database/migrations)

Local `supabase/migrations/` must list **every** version in `supabase_migrations.schema_migrations` on remote. If a version exists only on remote (empty `local` in `supabase migration list`), GitHub shows **MIGRATIONS: FAILED**.

## Current state (38 migrations — all synced 2026-07-15)

Run `supabase migration list --linked` — every row must show matching `local` and `remote`.

GitHub Actions **Supabase DB Push** (`.github/workflows/supabase-db-push.yml`) runs `supabase db push` on push to `main` when this folder changes.

Supabase CLI in CI is pinned to **2.109.1** (see workflow files).

## Duplicate version pairs (on remote — do not delete files)

Historical re-sync left parallel timestamps for the same logical change. **Both versions are applied on remote.** Removing either file breaks local/remote parity.

| Versions | Topic |
|----------|-------|
| `20260702115818` / `20260702120000` | showcase storage bucket |
| `20260706001900` / `20260706002434` | design_elements library |
| `20260706002000` / `20260706002707` | seed design elements |
| `20260706003000` / `20260714221121` | seed admin design element |
| `20260711010955` / `20260711030000` | blog_posts author slug |
| `20260711150000` / `20260714221113` | donations Stripe |
| `20260712224047` / `20260713003000` | admin mail sync |
| `20260715122913` / `20260715141417` | pg_cron keep-alive add + remove |

## pg_cron keep-alive

- `20260715122913` — added pg_cron job (later superseded)
- `20260715141417` — removed pg_cron job
- **Canonical keep-alive:** GitHub cron → edge function `keep-alive` (`.github/workflows/supabase-keep-alive.yml`)

## Verify sync

```bash
supabase link --project-ref laqnnzavwbojntfiqmxj
supabase migration list --linked
supabase db push --dry-run
```

Expected: all local = remote; dry-run reports "Remote database is up to date."

## Types

```bash
supabase gen types typescript --project-id laqnnzavwbojntfiqmxj > src/lib/database.types.ts
```

See [`../functions/README.md`](../functions/README.md) for edge functions.  
Full infra audit: [`../../docs/INFRA-AUDIT-REPORT.md`](../../docs/INFRA-AUDIT-REPORT.md).
