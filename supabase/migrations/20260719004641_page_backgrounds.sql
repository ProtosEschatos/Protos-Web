-- Per-route ambient background config (CSS fallback + WebGL scene key + optional Storage poster).
-- Scene code stays in the app; colors/enable flags/assets come from Supabase.
--
-- NOTE: This file mirrors what is already applied in the remote database
-- as migration 20260719004641 (recovered from supabase_migrations.schema_migrations).
-- It is idempotent so `supabase db reset` on a preview branch reapplies safely.

CREATE TABLE IF NOT EXISTS public.page_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  route_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  webgl_enabled boolean NOT NULL DEFAULT true,
  scene_type text NOT NULL DEFAULT 'particles',
  glow_color text NOT NULL DEFAULT '#ff6600',
  fog_color text NOT NULL DEFAULT '#0a0a1a',
  fallback_css text NOT NULL,
  poster_path text,
  particle_density smallint NOT NULL DEFAULT 100,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT page_backgrounds_route_key_check CHECK (
    route_key IN ('home', 'about', 'process', 'portfolio', 'services', 'blog', 'contact')
  ),
  CONSTRAINT page_backgrounds_density_check CHECK (particle_density BETWEEN 10 AND 200),
  CONSTRAINT page_backgrounds_site_route_unique UNIQUE (site_id, route_key)
);

CREATE INDEX IF NOT EXISTS page_backgrounds_site_enabled_idx
  ON public.page_backgrounds (site_id, enabled);

ALTER TABLE public.page_backgrounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active page backgrounds" ON public.page_backgrounds;
CREATE POLICY "Public read active page backgrounds"
  ON public.page_backgrounds
  FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

DROP POLICY IF EXISTS "Service role manage page backgrounds" ON public.page_backgrounds;
CREATE POLICY "Service role manage page backgrounds"
  ON public.page_backgrounds
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.page_backgrounds IS
  'Ambient page background config. CSS/poster from Storage; WebGL scene_type maps to app components.';

INSERT INTO public.page_backgrounds (
  site_id, route_key, enabled, webgl_enabled, scene_type,
  glow_color, fog_color, fallback_css, poster_path, particle_density, sort_order
)
SELECT
  s.id,
  v.route_key,
  true,
  true,
  v.scene_type,
  v.glow_color,
  v.fog_color,
  v.fallback_css,
  v.poster_path,
  v.particle_density,
  v.sort_order
FROM public.sites s
CROSS JOIN (
  VALUES
    ('home', 'particles_home', '#ff6600', '#0a0818', 'radial-gradient(ellipse at 30% 40%, rgba(255,102,0,0.28) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(139,92,246,0.22) 0%, transparent 50%), #020818', 'backgrounds/home-poster.svg', 100, 10),
    ('about', 'particles_about', '#a78bfa', '#0c0820', 'radial-gradient(ellipse at 35% 45%, rgba(139,92,246,0.38) 0%, transparent 58%), radial-gradient(ellipse at 72% 28%, rgba(6,182,212,0.28) 0%, transparent 52%), #020818', 'backgrounds/about-poster.svg', 90, 20),
    ('process', 'particles_process', '#ff8800', '#100818', 'radial-gradient(ellipse at 28% 50%, rgba(255,102,0,0.34) 0%, transparent 55%), radial-gradient(ellipse at 72% 48%, rgba(139,92,246,0.32) 0%, transparent 55%), #020818', 'backgrounds/process-poster.svg', 90, 30),
    ('portfolio', 'particles_portfolio', '#6366f1', '#080818', 'radial-gradient(ellipse at 50% 42%, rgba(99,102,241,0.38) 0%, transparent 62%), #020818', 'backgrounds/portfolio-poster.svg', 85, 40),
    ('services', 'particles_services', '#22d3ee', '#061018', 'radial-gradient(ellipse at 55% 48%, rgba(6,182,212,0.36) 0%, transparent 58%), #020818', 'backgrounds/services-poster.svg', 85, 50),
    ('blog', 'particles_blog', '#f59e0b', '#120a08', 'radial-gradient(ellipse at 42% 38%, rgba(255,136,0,0.32) 0%, transparent 52%), radial-gradient(ellipse at 68% 62%, rgba(139,92,246,0.26) 0%, transparent 52%), #020818', 'backgrounds/blog-poster.svg', 80, 60),
    ('contact', 'particles_contact', '#06b6d4', '#061218', 'radial-gradient(ellipse at 50% 48%, rgba(6,182,212,0.4) 0%, transparent 62%), #020818', 'backgrounds/contact-poster.svg', 80, 70)
) AS v(route_key, scene_type, glow_color, fog_color, fallback_css, poster_path, particle_density, sort_order)
WHERE s.domain = 'protosweb.eu'
ON CONFLICT (site_id, route_key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  webgl_enabled = EXCLUDED.webgl_enabled,
  scene_type = EXCLUDED.scene_type,
  glow_color = EXCLUDED.glow_color,
  fog_color = EXCLUDED.fog_color,
  fallback_css = EXCLUDED.fallback_css,
  poster_path = EXCLUDED.poster_path,
  particle_density = EXCLUDED.particle_density,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

UPDATE public.sites
SET theme_config = coalesce(theme_config, '{}'::jsonb) || jsonb_build_object(
  'ambient_backgrounds',
  jsonb_build_object(
    'source', 'page_backgrounds',
    'storage_bucket', 'site-assets',
    'storage_prefix', 'backgrounds/'
  )
)
WHERE domain = 'protosweb.eu';
