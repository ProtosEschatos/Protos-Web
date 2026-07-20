-- Cross-platform publish log for the admin panel.
-- One row per (platform, remote_id) — dedupes retries and lets the UI
-- link back to the live post on each platform.
create table if not exists public.published_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in (
    'bluesky','mastodon','threads','facebook','instagram',
    'ghost','hashnode','devto','medium','substack'
  )),
  kind text not null check (kind in ('short','article')),
  remote_id text,
  remote_url text,
  title text,
  body_preview text,
  status text not null default 'ok' check (status in ('ok','error')),
  error_message text,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  unique (platform, remote_id)
);

create index if not exists published_posts_platform_idx on public.published_posts (platform);
create index if not exists published_posts_created_at_idx on public.published_posts (created_at desc);
create index if not exists published_posts_status_idx on public.published_posts (status) where status = 'error';

alter table public.published_posts enable row level security;

drop policy if exists published_posts_service_role_all on public.published_posts;
create policy published_posts_service_role_all
  on public.published_posts
  for all
  to service_role
  using (true)
  with check (true);
