-- Harden security advisor warnings
-- Applied remotely via Supabase MCP (version 20260705193252).

-- 1. subscribers: remove permissive anon INSERT (WITH CHECK true).
-- Newsletter signups go through the `subscribe` edge function using the
-- service role key, so anon never needs direct insert access to this table.
DROP POLICY IF EXISTS "subscribers_anon_insert" ON public.subscribers;

-- 2. Donations are not wired into this site; do not expose the SECURITY DEFINER
-- aggregate to anon/authenticated via PostgREST (/rest/v1/rpc/get_donation_totals).
REVOKE EXECUTE ON FUNCTION public.get_donation_totals() FROM anon, authenticated;

-- 3. `showcase` is a public bucket served via public object URLs
-- (/storage/v1/object/public/showcase/...), which do not require a SELECT policy.
-- Removing the broad policy stops clients from listing the whole bucket.
DROP POLICY IF EXISTS "Public read showcase assets" ON storage.objects;
