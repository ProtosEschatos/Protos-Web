-- Remove pg_cron keep-alive job; GitHub Actions edge ping is the supported keep-alive path.
DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id FROM cron.job WHERE jobname = 'protos-keep-alive';
  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END $$;
