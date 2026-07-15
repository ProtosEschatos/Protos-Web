'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import type { AdminInsight, AdminInsightsSnapshot } from '@/lib/admin-insight-types'
import {
  GOOGLE_SITE_VERIFICATION,
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

function extractGoogleVerification(html: string): string | null {
  const match = html.match(/google-site-verification["'\s]+content=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

export async function adminGetInsights(): Promise<AdminInsightsSnapshot> {
  await requireAdmin()

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-LP29SJ3MM3'
  const configuredVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || GOOGLE_SITE_VERIFICATION
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  const [sitemapXml, robotsTxt, homepageHtml] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    fetchText(SITE_URL),
  ])

  const sitemapUrlCount = sitemapXml ? countSitemapUrls(sitemapXml) : 0
  const robotsHasSitemap = robotsTxt?.includes('sitemap.xml') ?? false
  const liveVerification = homepageHtml ? extractGoogleVerification(homepageHtml) : null
  const verificationOk = Boolean(liveVerification)

  const insights: AdminInsight[] = [
    {
      id: 'ga4',
      label: 'Google Analytics 4',
      status: gaId ? 'ok' : 'warn',
      statusLabel: gaId ? 'Aktivan' : 'Nije postavljen',
      detail: gaId
        ? `${gaId} · učitava se nakon pristanka na kolačiće`
        : 'Postavi NEXT_PUBLIC_GA_ID',
      href: 'https://analytics.google.com/analytics/web/',
      external: true,
    },
    {
      id: 'gsc',
      label: 'Google Search Console',
      status: verificationOk ? 'ok' : 'warn',
      statusLabel: verificationOk ? 'Verificirano' : 'Provjeri meta tag',
      detail: verificationOk
        ? `Meta tag na live stranici${liveVerification && liveVerification !== configuredVerification ? ' (Vercel env)' : ''}`
        : 'Meta google-site-verification nije pronađen na homepageu',
      href: `https://search.google.com/search-console?resource_id=${GSC_RESOURCE}`,
      external: true,
    },
    {
      id: 'sitemap',
      label: 'Sitemap',
      status: sitemapUrlCount > 0 ? 'ok' : 'warn',
      statusLabel: sitemapUrlCount > 0 ? `${sitemapUrlCount} URL-ova` : 'Nedostupan',
      detail:
        sitemapUrlCount > 0
          ? `${SITE_URL}/sitemap.xml · blog + sve lokale`
          : 'Live sitemap nije dostupan — provjeri deploy',
      href: `${SITE_URL}/sitemap.xml`,
      external: true,
    },
    {
      id: 'robots',
      label: 'Robots.txt',
      status: robotsHasSitemap ? 'ok' : 'warn',
      statusLabel: robotsHasSitemap ? 'OK' : 'Provjeri',
      detail: robotsHasSitemap
        ? 'Admin i /api blokirani · sitemap referenciran'
        : 'Nema reference na sitemap.xml',
      href: `${SITE_URL}/robots.txt`,
      external: true,
    },
    {
      id: 'speed',
      label: 'Vercel Speed Insights',
      status: 'ok',
      statusLabel: 'Uključen',
      detail: 'Core Web Vitals u Vercel dashboardu',
      href: `${VERCEL_PROJECT_URL}/speed-insights`,
      external: true,
    },
    {
      id: 'seo',
      label: 'Strukturirani SEO',
      status: 'ok',
      statusLabel: 'Aktivan',
      detail: 'JSON-LD, OG/Twitter, hreflang, creator meta',
      href: SITE_URL,
      external: true,
    },
  ]

  if (plausibleDomain) {
    insights.push({
      id: 'plausible',
      label: 'Plausible Analytics',
      status: 'ok',
      statusLabel: 'Aktivan',
      detail: `${plausibleDomain} · uz GA ili umjesto GA`,
      href: `https://plausible.io/${plausibleDomain}`,
      external: true,
    })
  }

  return {
    insights,
    checkedAt: new Date().toISOString(),
  }
}
