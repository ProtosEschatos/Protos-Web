-- Automation webhooks registry (Zapier / n8n / Make / Slack / generic HTTP)
-- auth_ciphertext holds an optional encrypted header value (bearer token,
-- basic auth string, custom header) — AES-256-GCM via ADMIN_KEYS_ENCRYPTION_KEY.

CREATE TABLE IF NOT EXISTS public.automation_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  method text NOT NULL DEFAULT 'POST',
  event text NOT NULL DEFAULT 'manual',
  auth_type text NOT NULL DEFAULT 'none',
  auth_header_name text,
  auth_ciphertext text,
  auth_iv text,
  auth_tag text,
  headers_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  body_template jsonb,
  notes text,
  is_enabled boolean NOT NULL DEFAULT true,
  last_fired_at timestamptz,
  last_status_code integer,
  last_response text,
  fire_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT automation_webhooks_method_check
    CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  CONSTRAINT automation_webhooks_auth_type_check
    CHECK (auth_type IN ('none', 'bearer', 'basic', 'custom')),
  CONSTRAINT automation_webhooks_event_check
    CHECK (event IN ('manual', 'contact.received', 'subscriber.new', 'donation.completed', 'portfolio.published', 'blog.published'))
);

COMMENT ON TABLE public.automation_webhooks IS
  'Outbound webhook definitions managed at /admin/automations. Fires manually or via app-side triggers.';
COMMENT ON COLUMN public.automation_webhooks.event IS
  'Trigger event id. manual = only fires from the admin UI button.';

CREATE INDEX IF NOT EXISTS automation_webhooks_event_idx
  ON public.automation_webhooks (event);
CREATE INDEX IF NOT EXISTS automation_webhooks_enabled_idx
  ON public.automation_webhooks (is_enabled) WHERE is_enabled = true;

CREATE OR REPLACE FUNCTION public.set_automation_webhooks_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_automation_webhooks_updated_at ON public.automation_webhooks;
CREATE TRIGGER set_automation_webhooks_updated_at
  BEFORE UPDATE ON public.automation_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_automation_webhooks_updated_at();

ALTER TABLE public.automation_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS automation_webhooks_service_role_all ON public.automation_webhooks;
CREATE POLICY automation_webhooks_service_role_all
  ON public.automation_webhooks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE ALL ON public.automation_webhooks FROM anon, authenticated;
GRANT ALL ON public.automation_webhooks TO service_role;
