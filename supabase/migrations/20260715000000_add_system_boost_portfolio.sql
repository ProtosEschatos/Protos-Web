-- System Boost is NOT a portfolio frame — it lives on the back wall gift portal only.
-- See supabase/migrations/20260715010000_remove_system_boost_from_portfolio_frames.sql

DELETE FROM public.admin_mail_sync
WHERE mailbox_id IN ('gmail-studio', 'martina');
