-- Admin design asset metadata (SVG lives in design/references/elements/admin-assets/)

INSERT INTO public.design_elements (category, name, description, source_board, tags, sort_order) VALUES
  (
    'admin-assets',
    'mystical_knight_mark',
    'Custom neon glass chess knight watermark for private admin panel background',
    'admin-assets',
    ARRAY['admin', 'knight', 'chess', 'mystical', 'neon', 'watermark'],
    1
  )
ON CONFLICT (category, name) DO NOTHING;
