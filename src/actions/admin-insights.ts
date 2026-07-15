'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import type { AdminInsight, AdminInsightsSnapshot, InsightStatus } from '@/lib/admin-insight-types'
import {
  BING_SITE_VERIFICATION,
  FB_PIXEL_ID,
  GOOGLE_BUSINESS_PROFILE_URL,
  GTM_ID,
  isBingVerificationConfigured,
  isFbPixelConfigured,
  isGoogleBusinessConfigured,
  isGtmConfigured,
  isPlausibleConfigured,
  PLAUSIBLE_DOMAIN,
  SEO_TOOL_URLS,
} from '@/lib/config/marketing'
import {
  GA4_MEASUREMENT_ID,
  SITE_DOMAIN,
  SITE_URL,
} from '@/lib/config/site'

export type { AdminInsight, AdminInsightsSnapshot, InsightStatus } from '@/lib/admin-insight-types'

const GSC_RESOURCE = encodeURIComponent(`sc-domain:${SITE_DOMAIN}`)
const VERCEL_PROJECT_URL = 'https://vercel.com/protoseschatos-projects/protos-web'

async function fetchText(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 },
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function countSitemapUrls(xml: string): number {
  return (xml.match(/<loc>/g) ?? []).length
}

function extractMetaContent(html: string, name: string): string | null {
  const pattern = new RegExp(
    `${name}["'\\s]+content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*${name}`,
    'i',
  )
  const match = html.match(pattern)
  return match?.[1] ?? match?.[2] ?? null
}

function insight(
  id: string,
  label: string,
  status: InsightStatus,
  statusLabel: string,
  detail: string,
  href: string,
  external = true,
): AdminInsight {
  return { id, label, status, statusLabel, detail, href, external }
}

export async function adminGetInsights(): Promise<AdminInsightsSnapshot> {
  await requireAdmin()

  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || GA4_MEASUREMENT_ID

  const [sitemapXml, robotsTxt, homepageHtml] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    fetchText(SITE_URL),
  ])

  const sitemapUrlCount = sitemapXml ? countSitemapUrls(sitemapXml) : 0
  const robotsHasSitemap = robotsTxt?.includes('sitemap.xml') ?? false
  const liveGoogleVerification = homepageHtml
    ? extractMetaContent(homepageHtml, 'google-site-verification')
    : null
  const liveBingVerification = homepageHtml
    ? extractMetaContent(homepageHtml, 'msvalidate.01')
    : null
  const hasJsonLdGraph = homepageHtml?.includes('"@graph"') ?? false

  const googleVerificationOk = Boolean(liveGoogleVerification)
  const bingConfigured = isBingVerificationConfigured()
  const bingLiveOk = bingConfigured && liveBingVerification === BING_SITE_VERIFICATION

  const insights: AdminInsight[] = [
    insight(
      'gsc',
      'Google Search Console',
      googleVerificationOk ? 'ok' : 'warn',
      googleVerificationOk ? 'Verificirano' : 'Provjeri meta tag',
      googleVerificationOk
        ? `Meta tag na live stranici · submit ${SITE_URL}/sitemap.xml u GSC`
        : 'Meta google-site-verification nije pronađen na homepageu',
      `https://search.google.com/search-console?resource_id=${GSC_RESOURCE}`,
    ),
    insight(
      'bing',
      'Bing Webmaster Tools',
      !bingConfigured ? 'off' : bingLiveOk ? 'ok' : 'warn',
      !bingConfigured ? 'Nije podešeno' : bingLiveOk ? 'Verificirano' : 'Meta nije live',
      !bingConfigured
        ? 'Bing Webmaster → Verify → HTML tag → postavi NEXT_PUBLIC_BING_SITE_VERIFICATION na Vercel'
        : bingLiveOk
          ? 'msvalidate.01 meta na live stranici · submit sitemap u Bing'
          : 'Env postavljen ali meta tag nije vidljiv na homepageu — redeploy',
      SEO_TOOL_URLS.bingWebmaster,
    ),
    insight(
      'ga4',
      'Google Analytics 4',
      gaId ? 'info' : 'off',
      gaId ? 'Kod spreman' : 'Nije postavljen',
      gaId
        ? `${gaId} · učitava se nakon pristanka na analitiku u modalu · brojke u GA dashboardu`
        : 'Postavi NEXT_PUBLIC_GA_ID na Vercel (default G-HR9HK4SR7Q u kodu)',
      SEO_TOOL_URLS.ga4,
    ),
    insight(
      'gtm',
      'Google Tag Manager',
      !isGtmConfigured() ? 'off' : 'info',
      !isGtmConfigured() ? 'Nije podešeno' : 'Env postavljen',
      !isGtmConfigured()
        ? 'tagmanager.google.com → Create container → kopiraj GTM-XXXX → NEXT_PUBLIC_GTM_ID na Vercel'
        : `${GTM_ID} · učitava se nakon pristanka na analitiku`,
      SEO_TOOL_URLS.tagManager,
    ),
    insight(
      'plausible',
      'Plausible Analytics',
      !isPlausibleConfigured() ? 'off' : 'info',
      !isPlausibleConfigured() ? 'Nije podešeno' : 'Env postavljen',
      !isPlausibleConfigured()
        ? 'plausible.io → Add site protosweb.eu → NEXT_PUBLIC_PLAUSIBLE_DOMAIN na Vercel'
        : `${PLAUSIBLE_DOMAIN} · učitava se nakon pristanka na analitiku`,
      SEO_TOOL_URLS.plausible,
    ),
    insight(
      'facebook-pixel',
      'Facebook Pixel',
      !isFbPixelConfigured() ? 'off' : 'info',
      !isFbPixelConfigured() ? 'Nije podešeno' : 'Env postavljen',
      !isFbPixelConfigured()
        ? 'Meta Events Manager → Pixel → kopiraj ID → NEXT_PUBLIC_FB_PIXEL_ID na Vercel'
        : `${FB_PIXEL_ID} · učitava se nakon pristanka na analitiku`,
      SEO_TOOL_URLS.facebookEvents,
    ),
    insight(
      'google-business',
      'Google Business Profile',
      !isGoogleBusinessConfigured() ? 'off' : 'info',
      !isGoogleBusinessConfigured() ? 'Nije podešeno' : 'URL postavljen',
      !isGoogleBusinessConfigured()
        ? 'business.google.com → verificiraj profil → NEXT_PUBLIC_GOOGLE_BUSINESS_URL na Vercel'
        : GOOGLE_BUSINESS_PROFILE_URL,
      SEO_TOOL_URLS.businessProfile,
    ),
    insight(
      'sitemap',
      'Sitemap',
      sitemapUrlCount > 0 ? 'ok' : 'warn',
      sitemapUrlCount > 0 ? `${sitemapUrlCount} URL-ova` : 'Nedostupan',
      sitemapUrlCount > 0
        ? `${SITE_URL}/sitemap.xml · submit u GSC i Bing Webmaster`
        : 'Live sitemap nije dostupan — provjeri deploy',
      `${SITE_URL}/sitemap.xml`,
    ),
    insight(
      'robots',
      'Robots.txt',
      robotsHasSitemap ? 'ok' : 'warn',
      robotsHasSitemap ? 'OK' : 'Provjeri',
      robotsHasSitemap
        ? 'Admin i /api blokirani · sitemap referenciran'
        : 'Nema reference na sitemap.xml',
      `${SITE_URL}/robots.txt`,
    ),
    insight(
      'seo',
      'Strukturirani SEO (JSON-LD)',
      hasJsonLdGraph ? 'ok' : 'warn',
      hasJsonLdGraph ? 'Aktivan' : 'Provjeri',
      hasJsonLdGraph
        ? 'JSON-LD @graph na homepageu · OG/Twitter/hreflang u layoutu'
        : 'JSON-LD nije pronađen na live homepageu',
      SITE_URL,
    ),
    insight(
      'rich-results',
      'Rich Results Test',
      hasJsonLdGraph ? 'info' : 'warn',
      hasJsonLdGraph ? 'Spremno za test' : 'Nema JSON-LD',
      hasJsonLdGraph
        ? 'Testiraj live URL u Google Rich Results alatu'
        : 'Prvo popravi JSON-LD na homepageu',
      SEO_TOOL_URLS.richResultsTest,
    ),
    insight(
      'speed',
      'Vercel Speed Insights',
      'ok',
      'Uključen',
      'Core Web Vitals u Vercel dashboardu (komponenta na stranici)',
      `${VERCEL_PROJECT_URL}/speed-insights`,
    ),
    insight(
      'lighthouse',
      'Lighthouse / PageSpeed',
      'info',
      'Vanjski alat',
      'pagespeed.web.dev — ručni test nakon deploya · nije automatski gate',
      SEO_TOOL_URLS.pageSpeedInsights,
    ),
    insight(
      'keyword-planner',
      'Keyword Planner',
      'info',
      'Vanjski alat',
      'Google Ads → Tools → Keyword Planner · research, ne kod na stranici',
      SEO_TOOL_URLS.keywordPlanner,
    ),
    insight(
      'trends',
      'Google Trends',
      'info',
      'Vanjski alat',
      'trends.google.com · research trendova, ne kod na stranici',
      SEO_TOOL_URLS.trends,
    ),
    insight(
      'seranking',
      'SE Ranking',
      'info',
      'Vanjski SaaS',
      'seranking.com · SEO monitoring pretplata · nema integracije u kod',
      SEO_TOOL_URLS.seRanking,
    ),
    insight(
      'semrush',
      'SEMrush',
      'info',
      'Vanjski SaaS',
      'semrush.com · SEO audit pretplata · nema integracije u kod',
      SEO_TOOL_URLS.semrush,
    ),
  ]

  return {
    insights,
    checkedAt: new Date().toISOString(),
  }
}
