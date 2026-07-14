-- Stripe donations: harden schema, RLS, public aggregate stats only

ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'eur',
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS locale text;

COMMENT ON COLUMN public.donations.amount IS 'Amount in EUR (whole units, e.g. 25 = 25 EUR)';
COMMENT ON COLUMN public.donations.status IS 'pending | completed | expired | failed';

-- Only count successful payments in public totals
CREATE OR REPLACE FUNCTION public.get_donation_totals()
RETURNS TABLE(cause text, total numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.cause, COALESCE(SUM(d.amount), 0)::numeric AS total
  FROM public.donations d
  WHERE d.status = 'completed'
    AND d.cause IS NOT NULL
  GROUP BY d.cause;
$$;

REVOKE EXECUTE ON FUNCTION public.get_donation_totals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_donation_totals() TO anon, authenticated, service_role;

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS donations_service_role_all ON public.donations;
CREATE POLICY donations_service_role_all
  ON public.donations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
