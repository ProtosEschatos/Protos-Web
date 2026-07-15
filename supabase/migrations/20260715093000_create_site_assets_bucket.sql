-- Public CDN bucket for site static assets (portfolio SVG fallbacks, boot video, brand).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read site assets" ON storage.objects;
CREATE POLICY "Public read site assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');
