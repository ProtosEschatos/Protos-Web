-- Design library metadata: mobile menu liquid morph reference (UI spec for Protos Web)
INSERT INTO public.design_elements (category, name, description, source_board, tags, sort_order)
VALUES (
  'ui-reference',
  'Mobile menu — liquid morph hamburger',
  'Liquid morphing hamburger→X for mobile nav. Protos palette: orange #ff6600, purple #8b5cf6, cyan #06b6d4, green #39ff14. Implemented in src/components/ui/LiquidMorphMenuButton.tsx. Upload board PNG via Admin → Integracije.',
  'protos-web-mobile-nav',
  ARRAY['hamburger', 'liquid-morph', 'mobile', 'menu', 'animation'],
  20
);
