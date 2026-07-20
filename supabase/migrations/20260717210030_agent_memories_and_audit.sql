-- Agent durable memory (Edge store-memory / recall-memory)
-- Service role via Edge only; no public client writes.
--
-- NOTE: This file mirrors what is already applied in the remote database
-- as migration 20260717210030 (a second-run of the same content — historical
-- duplicate that already exists in supabase_migrations.schema_migrations).
-- Recovered so Supabase Preview stops reporting drift; safe to re-run.

create table if not exists public.agent_memories (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}'::text[],
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_memories_namespace_key unique (namespace, key)
);

create index if not exists agent_memories_namespace_idx on public.agent_memories (namespace);
create index if not exists agent_memories_updated_at_idx on public.agent_memories (updated_at desc);

alter table public.agent_memories enable row level security;

create table if not exists public.audit_events (
  id bigserial primary key,
  source text not null,
  event text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_events enable row level security;
