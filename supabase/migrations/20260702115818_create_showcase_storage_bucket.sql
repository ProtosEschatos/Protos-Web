-- Public read-only bucket for portfolio showcase screenshots and environment art.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'showcase',
  'showcase',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read showcase assets" ON storage.objects;
CREATE POLICY "Public read showcase assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'showcase');
