import 'server-only'
import {
  GA4_MEASUREMENT_ID,
  GOOGLE_BUSINESS_PROFILE_URL,
  GOOGLE_SITE_VERIFICATION,
  PLAUSIBLE_DOMAIN,
  SITE_URL,
} from '@/lib/config/site'
import { locales } from '@/i18n'
import { ogImage, siteUrl } from '@/lib/config/seo'
import {
  ADMIN_API_KEY_PROVIDERS,
  type AdminApiKeyProviderId,
  type AdminApiKeyProviderMeta,
} from '@/lib/config/api-key-providers'
import { listAdminApiKeys } from '@/lib/queries/admin/api-keys'

export type SeoEnvStatus = {
  key: string
  label: string
  configured: boolean
  value: string | null
  fromEnv: boolean
  hint: string
  docsUrl?: string
}

export type SeoOverview = {
  siteUrl: string
  ogImageUrl: string
  locales: readonly string[]
  robotsUrl: string
  sitemapUrl: string
  env: {
    analytics: SeoEnvStatus[]
    verification: SeoEnvStatus[]
    monitoring: SeoEnvStatus[]
  }
  dashboards: Array<{
    id: string
    label: string
    href: string
    description: string
    configured: boolean
  }>
  keyPages: Array<{
    path: string
    label: string
    description: string
  }>
  metaPreview: {
    title: string
    description: string
    ogWidth: number
    ogHeight: number
  }
  connections: {
    social: SocialPublishingConnection[]
    publishing: SocialPublishingConnection[]
  }
}

export type SocialPublishingConnection = {
  provider: AdminApiKeyProviderId
  label: string
  docsUrl: string
  envHint?: string
  vaultCount: number
  vaultActive: number
  envConfigured: boolean
}

const HR_TITLE =
  'Izrada web stranica Zagreb | Protos Web — 3D & Full Stack Studio'
const HR_DESC =
  'Protos Web — web studio iz Zagreba. Izrada web stranica, UI/UX, SEO, e-trgovina i 3D WebGL showcase. Dario Imsirović i Martina Markulin. Hrvatska, Balkan i EU.'

function isNonEmpty(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0)
}

function buildConnections(
  category: 'social' | 'publishing',
  vaultByProvider: Map<string, { total: number; active: number }>,
): SocialPublishingConnection[] {
  return ADMIN_API_KEY_PROVIDERS.filter(
    (p: AdminApiKeyProviderMeta) => p.category === category,
  ).map((p) => {
    const stats = vaultByProvider.get(p.id) ?? { total: 0, active: 0 }
    const envConfigured = Boolean(
      p.envHint && process.env[p.envHint]?.trim(),
    )
    return {
      provider: p.id,
      label: p.label,
      docsUrl: p.docsUrl,
      envHint: p.envHint,
      vaultCount: stats.total,
      vaultActive: stats.active,
      envConfigured,
    }
  })
}

export async function getSeoOverview(): Promise<SeoOverview> {
  const gaEnv = process.env.NEXT_PUBLIC_GA_ID?.trim()
  const plausibleEnv = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim()
  const gscEnv = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
  const gbpEnv = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL?.trim()
  const cfEnv = process.env.CLOUDFLARE_API_TOKEN?.trim()
  const sentryEnv = process.env.SENTRY_AUTH_TOKEN?.trim()
  const vercelEnv = process.env.VERCEL_TOKEN?.trim()

  const analytics: SeoEnvStatus[] = [
    {
      key: 'NEXT_PUBLIC_GA_ID',
      label: 'Google Analytics 4',
      value: GA4_MEASUREMENT_ID,
      fromEnv: isNonEmpty(gaEnv),
      configured: isNonEmpty(GA4_MEASUREMENT_ID),
      hint: 'Public GA4 measurement ID. Default u src/lib/config/site.ts.',
      docsUrl: 'https://analytics.google.com',
    },
    {
      key: 'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
      label: 'Plausible',
      value: PLAUSIBLE_DOMAIN,
      fromEnv: isNonEmpty(plausibleEnv),
      configured: isNonEmpty(PLAUSIBLE_DOMAIN),
      hint: 'Tracked domain (radi paralelno s GA nakon cookie opt-in).',
      docsUrl: 'https://plausible.io',
    },
  ]

  const verification: SeoEnvStatus[] = [
    {
      key: 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION',
      label: 'Google Search Console',
      value: GOOGLE_SITE_VERIFICATION,
      fromEnv: isNonEmpty(gscEnv),
      configured: isNonEmpty(GOOGLE_SITE_VERIFICATION),
      hint: 'HTML meta verification. DNS TXT postavlji Cloudflare.',
      docsUrl: 'https://search.google.com/search-console',
    },
    {
      key: 'NEXT_PUBLIC_GOOGLE_BUSINESS_URL',
      label: 'Google Business Profile',
      value: GOOGLE_BUSINESS_PROFILE_URL,
      fromEnv: isNonEmpty(gbpEnv),
      configured: isNonEmpty(GOOGLE_BUSINESS_PROFILE_URL),
      hint: 'Public share link koji koristi mapa u footeru.',
      docsUrl: 'https://business.google.com',
    },
  ]

  const monitoring: SeoEnvStatus[] = [
    {
      key: 'CLOUDFLARE_API_TOKEN',
      label: 'Cloudflare (DNS / analytics)',
      value: cfEnv ? '••••••••' : null,
      fromEnv: isNonEmpty(cfEnv),
      configured: isNonEmpty(cfEnv),
      hint: 'Read-only token — DNS status, Zaptio audit.',
      docsUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    },
    {
      key: 'SENTRY_AUTH_TOKEN',
      label: 'Sentry (error monitoring)',
      value: sentryEnv ? '••••••••' : null,
      fromEnv: isNonEmpty(sentryEnv),
      configured: isNonEmpty(sentryEnv),
      hint: 'project:read scope za /admin live status.',
      docsUrl: 'https://sentry.io',
    },
    {
      key: 'VERCEL_TOKEN',
      label: 'Vercel deploy status',
      value: vercelEnv ? '••••••••' : null,
      fromEnv: isNonEmpty(vercelEnv),
      configured: isNonEmpty(vercelEnv),
      hint: 'Za dohvat build-a i env varijabli iz admina.',
      docsUrl: 'https://vercel.com/account/tokens',
    },
  ]

  const dashboards: SeoOverview['dashboards'] = [
    {
      id: 'ga4',
      label: 'GA4 Reports',
      href: `https://analytics.google.com/analytics/web/#/p${GA4_MEASUREMENT_ID.replace(/^G-/, '')}/reports`,
      description: 'Real-time, acquisition, engagement po jeziku.',
      configured: isNonEmpty(GA4_MEASUREMENT_ID),
    },
    {
      id: 'gsc',
      label: 'Google Search Console',
      href: 'https://search.google.com/search-console?resource_id=sc-domain%3Aprotosweb.eu',
      description: 'Performance, coverage, Rich Results i sitemapi.',
      configured: isNonEmpty(GOOGLE_SITE_VERIFICATION),
    },
    {
      id: 'plausible',
      label: 'Plausible dashboard',
      href: `https://plausible.io/${encodeURIComponent(PLAUSIBLE_DOMAIN)}`,
      description: 'Cookie-less pageviews, sources, top pages.',
      configured: isNonEmpty(PLAUSIBLE_DOMAIN),
    },
    {
      id: 'vercel-analytics',
      label: 'Vercel Analytics + Speed Insights',
      href: 'https://vercel.com/protoseschatos/protos-web/analytics',
      description: 'Core Web Vitals, RUM, cache hit ratio.',
      configured: true,
    },
    {
      id: 'gbp',
      label: 'Google Business Profile',
      href: 'https://business.google.com/dashboard',
      description: 'Reviews, opening hours, geo signals.',
      configured: isNonEmpty(GOOGLE_BUSINESS_PROFILE_URL),
    },
    {
      id: 'rich-results',
      label: 'Rich Results Test (home)',
      href: `https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`,
      description: 'Provjeri JSON-LD @graph (Organization, Person...).',
      configured: true,
    },
    {
      id: 'pagespeed',
      label: 'PageSpeed Insights (home)',
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`,
      description: 'Lighthouse + Core Web Vitals field data.',
      configured: true,
    },
    {
      id: 'schema-validator',
      label: 'Schema.org validator',
      href: `https://validator.schema.org/#url=${encodeURIComponent(SITE_URL)}`,
      description: 'Alternativni JSON-LD validator (nije Googlefly).',
      configured: true,
    },
  ]

  const keyPages = [
    { path: '/', label: 'Naslovnica', description: 'Hero + hreflang za sve lokalih' },
    { path: '/usluge', label: 'Usluge', description: 'ProfessionalService schema' },
    { path: '/o-nama', label: 'O nama', description: 'Person + Organization graph' },
    { path: '/portfolio', label: 'Portfolio', description: 'CreativeWork item list' },
    { path: '/portfolio-showcase', label: '3D Showcase', description: 'WebApplication schema' },
    { path: '/blog', label: 'Blog index', description: 'Blog + ItemList schema' },
    { path: '/kontakt', label: 'Kontakt', description: 'ContactPage + ContactPoint' },
  ]

  const vaultByProvider = new Map<string, { total: number; active: number }>()
  try {
    const keys = await listAdminApiKeys()
    for (const key of keys) {
      const bucket = vaultByProvider.get(key.provider) ?? { total: 0, active: 0 }
      bucket.total += 1
      if (key.isActive) bucket.active += 1
      vaultByProvider.set(key.provider, bucket)
    }
  } catch {
    // vault unavailable — connections show env-only status
  }

  return {
    siteUrl,
    ogImageUrl: ogImage.url,
    locales,
    robotsUrl: `${siteUrl}/robots.txt`,
    sitemapUrl: `${siteUrl}/sitemap.xml`,
    env: { analytics, verification, monitoring },
    dashboards,
    keyPages,
    metaPreview: {
      title: HR_TITLE,
      description: HR_DESC,
      ogWidth: ogImage.width,
      ogHeight: ogImage.height,
    },
    connections: {
      social: buildConnections('social', vaultByProvider),
      publishing: buildConnections('publishing', vaultByProvider),
    },
  }
}

export type LiveSitemapStats = {
  urlCount: number
  fetchedAt: string
  ok: boolean
  error?: string
}

export async function getLiveSitemapStats(): Promise<LiveSitemapStats> {
  try {
    const res = await fetch(`${siteUrl}/sitemap.xml`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) {
      return { urlCount: 0, fetchedAt: new Date().toISOString(), ok: false, error: `HTTP ${res.status}` }
    }
    const xml = await res.text()
    const urlCount = (xml.match(/<url>/g) ?? []).length
    return { urlCount, fetchedAt: new Date().toISOString(), ok: true }
  } catch (err) {
    return {
      urlCount: 0,
      fetchedAt: new Date().toISOString(),
      ok: false,
      error: (err as Error).message,
    }
  }
}
