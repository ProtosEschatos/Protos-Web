-- Re-hardening after donations-stripe migration re-granted execute on
-- `get_donation_totals` to anon/authenticated, and Supabase advisor keeps
-- flagging `showcase` and `site-assets` public buckets as LIST-able for anon.
--
-- Applied 2026-07-22.

-- 1. get_donation_totals: this aggregate is not consumed anywhere in the
-- app codebase (grep -r on src/ confirms zero call sites). Keep it in the
-- schema for future use but block anonymous / authenticated PostgREST
-- exposure via /rest/v1/rpc/get_donation_totals. Service_role can still
-- call it directly from server actions if we ever wire donations back in.
REVOKE EXECUTE ON FUNCTION public.get_donation_totals() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_donation_totals() TO service_role;

-- 2. Storage bucket LIST hardening.
-- `showcase` and `site-assets` are `public = true` buckets, so their objects
-- are always readable via /storage/v1/object/public/<bucket>/<path> — that
-- path bypasses RLS entirely, so dropping the SELECT policy does NOT break
-- direct object URLs. It DOES stop /storage/v1/object/list/<bucket> from
-- returning a full inventory to anonymous callers.
--
-- Idempotent drops of every known variant of the "public read" policies
-- that have been created historically on these buckets.
DROP POLICY IF EXISTS "Public read showcase assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read showcase"        ON storage.objects;
DROP POLICY IF EXISTS "Public read site assets"     ON storage.objects;
DROP POLICY IF EXISTS "Public read site-assets"     ON storage.objects;
DROP POLICY IF EXISTS "Public showcase read"        ON storage.objects;

-- Keep design-assets and admin-uploads as-is: they use signed URLs
-- (private buckets) — do not touch their policies here.
