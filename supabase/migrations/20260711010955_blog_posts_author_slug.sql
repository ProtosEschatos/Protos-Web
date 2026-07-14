-- Blog authorship for SEO byline and JSON-LD
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_slug text NOT NULL DEFAULT 'dario';

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_author_slug_check;

ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_author_slug_check
  CHECK (author_slug IN ('dario', 'martina', 'both'));

COMMENT ON COLUMN public.blog_posts.author_slug IS 'Author attribution: dario | martina | both';
