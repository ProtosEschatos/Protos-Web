-- Protos Web — initial schema
-- sites, blog_posts, contacts, subscribers, donations + RPC functions

CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  ip INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, email)
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  donor_name TEXT,
  message TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed site
INSERT INTO sites (domain, name)
VALUES ('protosweb.eu', 'Protos Web')
ON CONFLICT (domain) DO NOTHING;

-- RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_public_select ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY posts_service_all ON blog_posts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY contacts_service_all ON contacts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY subscribers_anon_insert ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY subscribers_service_all ON subscribers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY donations_service_all ON donations FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY sites_public_select ON sites FOR SELECT USING (true);

-- RPC: submit contact (anon-safe insert)
CREATE OR REPLACE FUNCTION submit_contact(
  p_name TEXT,
  p_email TEXT,
  p_service TEXT,
  p_message TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_site_id UUID;
BEGIN
  SELECT id INTO v_site_id FROM sites WHERE domain = 'protosweb.eu' LIMIT 1;
  IF v_site_id IS NULL THEN
    RAISE EXCEPTION 'Site not found';
  END IF;

  INSERT INTO contacts (site_id, name, email, service, message, ip)
  VALUES (v_site_id, p_name, p_email, p_service, p_message, inet_client_addr());
END;
$$;

GRANT EXECUTE ON FUNCTION submit_contact TO anon, authenticated;

-- RPC: public donation totals (no PII)
CREATE OR REPLACE FUNCTION get_donation_totals()
RETURNS TABLE(total_cents BIGINT, donation_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount_cents), 0)::BIGINT, COUNT(*)::BIGINT
  FROM donations;
$$;

GRANT EXECUTE ON FUNCTION get_donation_totals TO anon, authenticated;

-- Seed blog posts
INSERT INTO blog_posts (site_id, title, slug, excerpt, published, published_at)
SELECT s.id, v.title, v.slug, v.excerpt, true, v.published_at::timestamptz
FROM sites s,
(VALUES
  ('Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', 'email-marketing-subscribers', '1,000 email subscribers are worth more than 10,000 Instagram followers.', '2026-06-15'),
  ('Web Analytics — How Do You Know Who Visits Your Site?', 'web-analytics-guide', 'Web analytics shows who visits your site, where they come from, and what they do.', '2026-06-15'),
  ('What is a Landing Page and When to Use It for Maximum Impact?', 'landing-page-guide', 'A landing page is a page with one goal — turning visitors into customers.', '2026-06-17')
) AS v(title, slug, excerpt, published_at)
WHERE s.domain = 'protosweb.eu'
ON CONFLICT (site_id, slug) DO NOTHING;
