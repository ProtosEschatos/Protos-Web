-- System Boost is the gift (poklon) on the back wall — not a portfolio_items frame.
DELETE FROM public.portfolio_items
WHERE language = 'hr'
  AND (
    lower(title) LIKE '%system boost%'
    OR project_url ILIKE '%system-boost%'
  );
