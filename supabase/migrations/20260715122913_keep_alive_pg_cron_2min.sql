-- Applied on remote as 20260715122913; file kept for migration history sync with Supabase dashboard.
-- GitHub Actions keep-alive uses supabase-keep-alive.yml (edge function), not pg_cron.
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job WHERE jobname = 'protos-keep-alive';
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'protos-keep-alive',
  '*/2 * * * *',
  $$SELECT count(*)::bigint FROM public.sites;$$
);
