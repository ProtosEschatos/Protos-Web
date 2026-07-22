-- Revokable admin sessions.
--
-- Prior state: admin auth cookie was a static HMAC of `SESSION_SALT` signed
-- with `ADMIN_SECRET`. Every valid cookie value was byte-identical, meaning
-- a leaked cookie could only be revoked by rotating `ADMIN_SECRET` (which
-- kicks EVERY existing session). No per-session identity, no audit surface.
--
-- New state: admin login generates a per-session opaque token (32 random
-- bytes). The cookie stores the plaintext token; the DB stores its SHA-256
-- hash. Verification looks up the hash and enforces `expires_at > now()`
-- AND `revoked_at IS NULL`. Revoke = single-row UPDATE.
--
-- RLS: enabled with zero anon/authenticated policies. Only service_role
-- can read/write via the admin server actions.
--
-- Applied 2026-07-22.

CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash   text        NOT NULL UNIQUE,
  ip           text        NULL,
  user_agent   text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz NULL
);

CREATE INDEX IF NOT EXISTS admin_sessions_token_hash_idx  ON public.admin_sessions (token_hash);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx  ON public.admin_sessions (expires_at);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
-- Deliberately NO policies for anon/authenticated. service_role bypasses RLS.

COMMENT ON TABLE public.admin_sessions IS
  'Opaque-token admin sessions. Cookie stores plaintext, this table stores sha256(token). Revokable via revoked_at.';
