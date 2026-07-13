# Migrations

Live database schema for project `laqnnzavwbojntfiqmxj` is managed via **Supabase MCP** and the **Supabase CLI** — not by committing new SQL files from this repo unless you intentionally add a migration and apply it remotely.

## Applied remote migration versions

| Version        | Name                                | In repo |
|----------------|-------------------------------------|---------|
| 20260615174512 | init_tables                         | no (baseline, remote-only) |
| 20260615174539 | seed_blog                           | no (baseline, remote-only) |
| 20260622120000 | schema_security_hardening           | no (baseline, remote-only) |
| 20260622130000 | drop_unused_tables                  | no (baseline, remote-only) |
| 20260622140000 | final_rls_lockdown                  | no (baseline, remote-only) |
| 20260623055126 | security_cleanup                    | no (baseline, remote-only) |
| 20260623062612 | drop_dead_triggers                  | no (baseline, remote-only) |
| 20260623064551 | backend_sites_rls                   | no (baseline, remote-only) |
| 20260702115818 | create_showcase_storage_bucket      | yes |
| 20260705193252 | harden_security_advisors            | yes |
| 20260705193549 | create_contacts_submit_form_webhook | yes |

To inspect the current list: `supabase link --project-ref laqnnzavwbojntfiqmxj` then `supabase migration list --linked`.

### Full baseline dump

The earliest tables/RLS/functions (versions `2026061*`–`2026062*`) were created directly
against the remote project and are not yet checked in as SQL. To capture a complete,
re-runnable baseline once you have DB credentials:

```bash
supabase link --project-ref laqnnzavwbojntfiqmxj
supabase db dump --linked -f supabase/migrations/00000000000000_baseline_schema.sql
```

TypeScript row/insert/update types for the current schema are generated into
[`../../src/lib/database.types.ts`](../../src/lib/database.types.ts) and consumed by the
typed Supabase client in `src/lib/supabase.ts`. Regenerate with:

```bash
supabase gen types typescript --project-id laqnnzavwbojntfiqmxj > src/lib/database.types.ts
```

## Contact emails (database webhook)

Contact form submissions insert into `contacts` via RPC `submit_contact`. Admin and auto-reply emails are handled by the `submit-form` edge function.

The `contacts` INSERT → `submit-form` webhook is now managed as code in migration
`20260705193549_create_contacts_submit_form_webhook.sql` (a trigger calling
`supabase_functions.http_request`). No manual dashboard step is required; if you
recreate the project, applying migrations restores it.

See [`../functions/README.md`](../functions/README.md) for edge function secrets and deploy details.
