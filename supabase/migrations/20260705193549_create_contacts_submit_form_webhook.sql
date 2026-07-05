-- Restore the Database Webhook that invokes the `submit-form` edge function on
-- every new contact submission (admin notification + auto-reply emails).
-- Applied remotely via Supabase MCP (version 20260705193549).
--
-- This was previously expected as a manual dashboard step, but no trigger
-- existed on public.contacts, so contact emails were never sent. It is now
-- managed as code. Depends on the `submit-form` edge function and its secrets
-- (RESEND_API_KEY / RESEND_FROM_EMAIL / CONTACT_EMAIL) — see
-- ../functions/README.md.
DROP TRIGGER IF EXISTS "contacts-insert-submit-form" ON public.contacts;
CREATE TRIGGER "contacts-insert-submit-form"
  AFTER INSERT ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://laqnnzavwbojntfiqmxj.supabase.co/functions/v1/submit-form',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}',
    '5000'
  );
