-- Portfolio allowlist sync: Bodulica, Auto-Moto, Golden Pawn, LuminaDent.
-- Deactivate Zeus Trading, Cosmic Blueprint, Protos Web (not in approved showcase set).
-- System Boost remains the back-wall poklon only (featured-demo.ts).

UPDATE portfolio_items
SET active = false
WHERE language = 'hr'
  AND (
    project_url ILIKE '%zeustrading%'
    OR project_url ILIKE '%cosmic-blueprint%'
    OR project_url ILIKE '%protosweb.eu%'
    OR project_url ILIKE '%system-boost%'
  );

INSERT INTO portfolio_items (language, title, tag, description, project_url, sort_order, active, featured)
SELECT
  'hr',
  v.title,
  v.tag,
  v.description,
  v.project_url,
  v.sort_order,
  true,
  false
FROM (
  VALUES
    ('Auto Moto Zagreb', 'Automotive', 'Auto servis landing — moderan UI, kontakt i usluge.', 'https://auto-moto.vercel.app', 2),
    ('LuminaDent', 'Healthcare', 'Dentalna ordinacija — višejezična landing stranica, kontakt forma.', 'https://lumina-dent.vercel.app', 4)
) AS v(title, tag, description, project_url, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio_items p
  WHERE p.language = 'hr' AND p.project_url = v.project_url
);

UPDATE portfolio_items SET sort_order = 1 WHERE language = 'hr' AND project_url ILIKE '%bodulica%';
UPDATE portfolio_items SET sort_order = 2 WHERE language = 'hr' AND project_url ILIKE '%auto-moto%';
UPDATE portfolio_items SET sort_order = 3 WHERE language = 'hr' AND project_url ILIKE '%golden-pawn%';
UPDATE portfolio_items SET sort_order = 4 WHERE language = 'hr' AND project_url ILIKE '%lumina-dent%';
