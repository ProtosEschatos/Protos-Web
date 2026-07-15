/** Marketing / SEO IDs — empty env = feature off (never hardcode fake values). */

function envTrim(key: string): string {
  return process.env[key]?.trim() ?? ''
}

export const GTM_ID = envTrim('NEXT_PUBLIC_GTM_ID')

export const FB_PIXEL_ID = envTrim('NEXT_PUBLIC_FB_PIXEL_ID')

export const BING_SITE_VERIFICATION = envTrim('NEXT_PUBLIC_BING_SITE_VERIFICATION')

export const PLAUSIBLE_DOMAIN = envTrim('NEXT_PUBLIC_PLAUSIBLE_DOMAIN')

export const GOOGLE_BUSINESS_PROFILE_URL = envTrim('NEXT_PUBLIC_GOOGLE_BUSINESS_URL')

export function isGtmConfigured(): boolean {
  return GTM_ID.length > 0 && GTM_ID.startsWith('GTM-')
}

export function isFbPixelConfigured(): boolean {
  return FB_PIXEL_ID.length > 0 && /^\d+$/.test(FB_PIXEL_ID)
}

export function isBingVerificationConfigured(): boolean {
  return BING_SITE_VERIFICATION.length > 0
}

export function isPlausibleConfigured(): boolean {
  return PLAUSIBLE_DOMAIN.length > 0
}

export function isGoogleBusinessConfigured(): boolean {
  return GOOGLE_BUSINESS_PROFILE_URL.startsWith('https://')
}

/** External tool URLs from SEO checklist (paper list). */
export const SEO_TOOL_URLS = {
  bingWebmaster: 'https://www.bing.com/webmasters/home',
  searchConsole: 'https://search.google.com/search-console?resource_id=sc-domain%3Aprotosweb.eu',
  keywordPlanner: 'https://ads.google.com/home/tools/keyword-planner/',
  trends: 'https://trends.google.com/trends/',
  tagManager: 'https://tagmanager.google.com/',
  ga4: 'https://analytics.google.com/analytics/web/',
  businessProfile: 'https://business.google.com/',
  seRanking: 'https://seranking.com/',
  semrush: 'https://www.semrush.com/',
  plausible: 'https://plausible.io/',
  richResultsTest: 'https://search.google.com/test/rich-results?url=https%3A%2F%2Fprotosweb.eu',
  lighthouse: 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fprotosweb.eu',
  pageSpeedInsights: 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fprotosweb.eu',
  facebookEvents: 'https://business.facebook.com/events_manager2',
} as const
