-- Admin-managed encrypted API keys registry
-- Ciphertext + IV + auth tag are stored separately (AES-256-GCM).
-- Only service_role (server actions with SUPABASE_SERVICE_ROLE_KEY) can read.

CREATE TABLE IF NOT EXISTS public.admin_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  label text NOT NULL,
  env_target text NOT NULL DEFAULT 'all',
  masked_hint text,
  ciphertext text NOT NULL,
  iv text NOT NULL,
  auth_tag text NOT NULL,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_api_keys_env_target_check
    CHECK (env_target IN ('all', 'production', 'preview', 'development'))
);

COMMENT ON TABLE public.admin_api_keys IS
  'Runtime API key vault, managed from /admin/kljucevi. Values are AES-256-GCM encrypted with ADMIN_KEYS_ENCRYPTION_KEY.';
COMMENT ON COLUMN public.admin_api_keys.provider IS
  'Provider id (openai, stripe, resend, sketchfab, ... or custom).';
COMMENT ON COLUMN public.admin_api_keys.label IS
  'Human label distinguishing multiple keys per provider (e.g. Live, Test, Personal).';
COMMENT ON COLUMN public.admin_api_keys.env_target IS
  'Deployment scope: all | production | preview | development.';
COMMENT ON COLUMN public.admin_api_keys.masked_hint IS
  'Safe-to-show masked preview, e.g. sk_live_...abcd.';

CREATE INDEX IF NOT EXISTS admin_api_keys_provider_idx
  ON public.admin_api_keys (provider);
CREATE INDEX IF NOT EXISTS admin_api_keys_active_idx
  ON public.admin_api_keys (is_active) WHERE is_active = true;

-- keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_admin_api_keys_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_admin_api_keys_updated_at ON public.admin_api_keys;
CREATE TRIGGER set_admin_api_keys_updated_at
  BEFORE UPDATE ON public.admin_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.set_admin_api_keys_updated_at();

-- Lockdown: only service_role can touch this table.
ALTER TABLE public.admin_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_api_keys_service_role_all ON public.admin_api_keys;
CREATE POLICY admin_api_keys_service_role_all
  ON public.admin_api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE ALL ON public.admin_api_keys FROM anon, authenticated;
GRANT ALL ON public.admin_api_keys TO service_role;
