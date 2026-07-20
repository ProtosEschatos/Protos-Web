-- Private storage bucket for admin uploads (images, videos, 3D models, textures).
-- Served through signed URLs or (for is_published rows) via anon SELECT on the
-- metadata table + a signed URL minted server-side by lib/assets helper.
insert into storage.buckets (id, name, public)
values ('admin-uploads', 'admin-uploads', false)
on conflict (id) do nothing;

create table if not exists public.admin_assets (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('image','video','model_glb','model_gltf','texture','audio','document','other')),
  bucket text not null default 'admin-uploads',
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  duration_seconds numeric,
  original_filename text,
  label text,
  tags text[] not null default array[]::text[],
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  uploaded_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_assets_category_idx on public.admin_assets (category);
create index if not exists admin_assets_tags_gin_idx on public.admin_assets using gin (tags);
create index if not exists admin_assets_published_idx on public.admin_assets (is_published) where is_published;
create index if not exists admin_assets_created_at_idx on public.admin_assets (created_at desc);

-- Keep updated_at fresh on every UPDATE.
create or replace function public.admin_assets_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists admin_assets_updated_at on public.admin_assets;
create trigger admin_assets_updated_at
  before update on public.admin_assets
  for each row execute function public.admin_assets_set_updated_at();

alter table public.admin_assets enable row level security;

drop policy if exists admin_assets_service_role_all on public.admin_assets;
create policy admin_assets_service_role_all
  on public.admin_assets
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists admin_assets_anon_read_published on public.admin_assets;
create policy admin_assets_anon_read_published
  on public.admin_assets
  for select
  to anon
  using (is_published = true);

drop policy if exists admin_assets_authenticated_read_published on public.admin_assets;
create policy admin_assets_authenticated_read_published
  on public.admin_assets
  for select
  to authenticated
  using (is_published = true);

-- Storage-object-level policies for the private admin-uploads bucket:
-- only service_role can read/write objects. Public consumption always goes
-- through the metadata SELECT + a signed URL minted server-side.
drop policy if exists admin_uploads_service_role_all on storage.objects;
create policy admin_uploads_service_role_all
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'admin-uploads')
  with check (bucket_id = 'admin-uploads');
