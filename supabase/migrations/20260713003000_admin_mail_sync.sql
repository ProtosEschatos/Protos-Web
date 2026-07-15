-- Cached IMAP snapshots for /admin/inbox (updated by cron + manual refresh).
-- RLS enabled with no public policies — service role only.

create table if not exists public.admin_mail_sync (
  mailbox_id text primary key
    check (mailbox_id in ('zoho', 'martina')),
  messages jsonb not null default '[]'::jsonb,
  error text,
  synced_at timestamptz not null default now()
);

alter table public.admin_mail_sync enable row level security;

create index if not exists admin_mail_sync_synced_at_idx
  on public.admin_mail_sync (synced_at desc);
