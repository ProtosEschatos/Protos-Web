# Migrations

Project: `laqnnzavwbojntfiqmxj`  
Dashboard: [Database → Migrations](https://supabase.com/dashboard/project/laqnnzavwbojntfiqmxj/database/migrations)

Local `supabase/migrations/` must list **every** version in `supabase_migrations.schema_migrations` on remote. If a version exists only on remote (empty `local` in `supabase migration list`), GitHub branching shows **MIGRATIONS: FAILED**.

## Current state (24 migrations — all synced)

| Version | Name | Repo file |
|---------|------|-----------|
| 20260615174512 | init_tables | anchor |
| 20260615174539 | seed_blog | anchor |
| 20260622120000 | schema_security_hardening | anchor |
| 20260622130000 | drop_unused_tables | anchor |
| 20260622140000 | final_rls_lockdown | anchor |
| 20260623055126 | security_cleanup | anchor |
| 20260623062612 | drop_dead_triggers | anchor |
| 20260623064551 | backend_sites_rls | anchor |
| 20260702115818 | create_showcase_storage_bucket | full SQL |
| 20260705193252 | harden_security_advisors | full SQL |
| 20260705193549 | create_contacts_submit_form_webhook | full SQL |
| 20260706002434 | design_elements_library | full SQL |
| 20260706002707 | seed_design_elements | full SQL |
| 20260710163317 | blog_post_bodulica_shop_hr | anchor |
| 20260711010955 | blog_posts_author_slug | full SQL |
| 20260712211748 | dedupe_content_tables_fix_hr_text | anchor |
| 20260712212525 | fix_pricing_plans_diacritics | anchor |
| 20260712213029 | fix_services_subtitle_diacritics | anchor |
| 20260712213541 | rename_icon_values_to_lucide_names | anchor |
| 20260712220315 | activate_portfolio_display_bodulica_golden_pawn | anchor |
| 20260712220608 | update_golden_pawn_portfolio_url | anchor |
| 20260712224047 | admin_mail_sync | anchor |
| 20260714221113 | donations_stripe_integration | full SQL |
| 20260714221121 | seed_admin_design_element | full SQL |

**Anchor** = `SELECT 1` placeholder — schema already applied on remote before this repo was synced. Safe: CLI skips versions already in `schema_migrations`.

**Removed duplicates** (never re-add):
- `20260713003000_admin_mail_sync`
- `20260713010000_drop_gmail_studio_mailbox`
- `20260706003000_seed_admin_design_element` → replaced by `20260714221121`
- `20260711150000_donations_stripe_integration` → replaced by `20260714221113`

## Verify sync

```bash
supabase link --project-ref laqnnzavwbojntfiqmxj
supabase migration list --linked
```

Every row must show matching `local` and `remote` (no empty `local`).

## Types

```bash
supabase gen types typescript --project-id laqnnzavwbojntfiqmxj > src/lib/database.types.ts
```

See [`../functions/README.md`](../functions/README.md) for edge functions.
