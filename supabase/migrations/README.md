# Migrations

Live database schema for project `laqnnzavwbojntfiqmxj` is managed via **Supabase MCP** and the **Supabase CLI** — not by committing new SQL files from this repo unless you intentionally add a migration and apply it remotely.

## Applied remote migration versions

| Version        | Applied (UTC)       |
|----------------|---------------------|
| 20260615174512 | 2026-06-15 17:45:12 |
| 20260615174539 | 2026-06-15 17:45:39 |
| 20260622120000 | 2026-06-22 12:00:00 |
| 20260622130000 | 2026-06-22 13:00:00 |
| 20260622140000 | 2026-06-22 14:00:00 |
| 20260623055126 | 2026-06-23 05:51:26 |
| 20260623062612 | 2026-06-23 06:26:12 |
| 20260623064551 | 2026-06-23 06:45:51 |

To inspect the current list: `supabase link --project-ref laqnnzavwbojntfiqmxj` then `supabase migration list --linked`.

## Contact emails (database webhook)

Contact form submissions insert into `contacts` via RPC `submit_contact`. Admin and auto-reply emails are handled by the `submit-form` edge function.

**One-time setup** in Supabase Dashboard → Database → Webhooks:

| Field | Value |
|-------|-------|
| Table | `public.contacts` |
| Events | `INSERT` |
| URL / Function | `submit-form` |

See [`../functions/README.md`](../functions/README.md) for edge function secrets and deploy details.
