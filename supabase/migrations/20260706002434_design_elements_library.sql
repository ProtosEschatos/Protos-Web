-- Internal design reference library: catalog table + storage bucket.
-- See design/references/README.md and .cursor/rules/protos-web.mdc.

CREATE TABLE IF NOT EXISTS public.design_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  source_board text,
  storage_path text,
  image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, name)
);

COMMENT ON TABLE public.design_elements IS
  'Internal design reference library — catalog of UI element concepts. Images live in the design-assets storage bucket. Mirrors design/references/README.md.';

CREATE INDEX IF NOT EXISTS design_elements_category_idx ON public.design_elements (category);

-- Reference library is internal: RLS on, no anon/authenticated policies.
-- Only the service role (bypasses RLS) can read/write.
ALTER TABLE public.design_elements ENABLE ROW LEVEL SECURITY;

-- Public bucket so direct object URLs work; no SELECT policy on storage.objects
-- (prevents listing, consistent with the hardened showcase bucket setup).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-assets',
  'design-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
