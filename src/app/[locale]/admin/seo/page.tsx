import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import SeoManager from '@/components/features/admin/SeoManager'
import {
  getLiveSitemapStats,
  getSeoOverview,
} from '@/lib/queries/admin/seo-overview'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

const ROBOTS_SNIPPET = `User-Agent: *
Allow: /
Disallow: /admin
Disallow: /*/admin
Disallow: /api/

User-Agent: GPTBot
User-Agent: ClaudeBot
User-Agent: PerplexityBot
User-Agent: Google-Extended
User-Agent: anthropic-ai
Allow: /
Disallow: /admin

Sitemap: https://protosweb.eu/sitemap.xml
Host: protosweb.eu`

export default async function AdminSeoPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const overview = getSeoOverview()
  const liveSitemap = await getLiveSitemapStats()

  return (
    <AdminPageShell
      title="SEO & Analitika"
      description="Sve što se tiče Google Analytics, Search Console, Plausible, sitemap-a, robots.txt, OpenGraph i verifikacija na jednom mjestu."
    >
      <SeoManager overview={overview} liveSitemap={liveSitemap} robotsSnippet={ROBOTS_SNIPPET} />
    </AdminPageShell>
  )
}
