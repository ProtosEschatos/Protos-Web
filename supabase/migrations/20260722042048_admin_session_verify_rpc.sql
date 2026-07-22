-- Admin session verify — SECURITY DEFINER RPC for Edge middleware.
--
-- Prior state: `verifyAdminSessionEdge` in middleware called
-- `/rest/v1/admin_sessions?token_hash=eq.<hash>` with `SUPABASE_SERVICE_ROLE_KEY`.
-- That path is fragile:
--   1. Requires service_role key to be present + valid on the Edge runtime
--      env. If the key is rotated in Supabase and Vercel is not updated,
--      EVERY admin request is 401 → middleware fails-closed → user cannot
--      log in even with the right password (the login POST works because it
--      runs in Node.js, but the very next request bounces to /login).
--   2. Exposes service_role in the Edge bundle env — larger blast radius
--      if the Edge runtime is ever compromised.
--
-- New state: middleware calls `POST /rest/v1/rpc/verify_admin_session_by_hash`
-- with anon key (public, low-privilege). The function is `SECURITY DEFINER`
-- so it can bypass RLS on `admin_sessions` for its narrow read purpose —
-- returning only `revoked_at` and `expires_at`, never leaking the full
-- row or the token_hash.
--
-- Security analysis:
--   - Anon caller must know the exact 64-char sha256 token_hash to get a
--     match. That's the same information they'd need to authenticate anyway.
--   - Function LIMITs 1, no fuzzy match, no enumeration.
--   - Returns only revoked_at + expires_at (nothing that helps escalate).
--   - RLS on `admin_sessions` remains: no anon SELECT, no anon INSERT/UPDATE/DELETE.
--     Only service_role (server actions, admin login) can write to the table.
--
-- Applied 2026-07-22.

CREATE OR REPLACE FUNCTION public.verify_admin_session_by_hash(t text)
RETURNS TABLE(revoked_at timestamptz, expires_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT revoked_at, expires_at
  FROM public.admin_sessions
  WHERE token_hash = t
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.verify_admin_session_by_hash(text) IS
  'Edge-middleware verify path. Bypasses admin_sessions RLS for a single narrow read (revoked_at, expires_at). Caller must already possess the exact 64-char sha256 token_hash — no enumeration possible.';

-- Anyone can call — the function itself already requires the caller to
-- possess the token_hash. RLS on admin_sessions still blocks direct reads.
REVOKE ALL ON FUNCTION public.verify_admin_session_by_hash(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_admin_session_by_hash(text) TO anon, authenticated, service_role;
