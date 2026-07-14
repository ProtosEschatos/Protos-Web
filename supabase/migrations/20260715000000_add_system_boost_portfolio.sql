-- System Boost: regular portfolio frame (same as other showcase projects)
INSERT INTO public.portfolio_items (
  title,
  tag,
  description,
  project_url,
  image_url,
  active,
  featured,
  sort_order,
  language
)
SELECT
  'System Boost',
  'Edukacija',
  'Interaktivni edukacijski modul — poklon uz program optimizacije sustava.',
  'https://www.protosweb.eu/demos/system-boost/index.html',
  NULL,
  true,
  true,
  60,
  'hr'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.portfolio_items
  WHERE language = 'hr'
    AND (
      lower(title) LIKE '%system boost%'
      OR project_url ILIKE '%system-boost%'
    )
);

-- Remove stale admin mail sync rows for deleted mailboxes
DELETE FROM public.admin_mail_sync
WHERE mailbox_id IN ('gmail-studio', 'martina');
