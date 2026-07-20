-- Supabase advisor `function_search_path_mutable`: set an explicit,
-- non-user-controllable search_path on every trigger helper we own,
-- so a hostile user cannot shadow `public.now()` etc. via search_path.
alter function public.set_admin_api_keys_updated_at() set search_path = pg_catalog, public;
alter function public.set_automation_webhooks_updated_at() set search_path = pg_catalog, public;
alter function public.admin_assets_set_updated_at() set search_path = pg_catalog, public;
