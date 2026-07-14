# Migrations

Project: `laqnnzavwbojntfiqmxj`

Migration **filenames must match** `supabase_migrations.schema_migrations.version` on the remote database. If versions in this folder diverge from remote, Supabase GitHub branching shows repeated **MIGRATIONS: FAILED** (see Dashboard → Branching → View logs).

## Files in this repo (aligned to remote)

| Version | File | Remote status |
|---------|------|---------------|
| 20260702115818 | create_showcase_storage_bucket | applied |
| 20260705193252 | harden_security_advisors | applied |
| 20260705193549 | create_contacts_submit_form_webhook | applied |
| 20260706002434 | design_elements_library | applied |
| 20260706002707 | seed_design_elements | applied |
| 20260706003000 | seed_admin_design_element | pending — apply on next sync |
| 20260711010955 | blog_posts_author_slug | applied |
| 20260711150000 | donations_stripe_integration | pending (schema live; register on sync) |

Older remote-only versions (`20260615174512` … `20260712224047`) were applied via MCP/CLI before this repo was fully synced. They are **not** duplicated here to avoid version collisions.

**Removed duplicates (already on remote as `20260712224047` + constraint fix):**
- ~~`20260713003000_admin_mail_sync`~~
- ~~`20260713010000_drop_gmail_studio_mailbox`~~

## Inspect remote history

```bash
supabase link --project-ref laqnnzavwbojntfiqmxj
supabase migration list --linked
```

Or Supabase Dashboard → Database → Migrations.

## Types

Regenerate after schema changes:

```bash
supabase gen types typescript --project-id laqnnzavwbojntfiqmxj > src/lib/database.types.ts
```

See [`../functions/README.md`](../functions/README.md) for edge functions.
