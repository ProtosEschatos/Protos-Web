import { LEGAL_TERMS_VERSION } from '@/lib/config/site'

export const SITE_CONSENT_KEY = 'protos-site-consent-v1'
export const COOKIE_STORAGE_KEY = 'protos-cookies'
export const COOKIE_CONSENT_EVENT = 'protos-cookie-consent-updated'
export const SITE_CONSENT_EVENT = 'protos-site-consent-updated'

export type SiteConsent = {
  termsVersion: string
  termsAccepted: true
  essential: true
  analytics: boolean
  acceptedAt: string
}

export type CookiePreferences = {
  essential: true
  analytics: boolean
  acceptedAt: string
}

export function getSiteConsent(): SiteConsent | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SITE_CONSENT_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SiteConsent
    if (parsed?.termsAccepted && parsed?.essential && parsed.termsVersion === LEGAL_TERMS_VERSION) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

/** @deprecated Use getSiteConsent — kept for Analytics compatibility */
export function getCookiePreferences(): CookiePreferences | null {
  const consent = getSiteConsent()
  if (!consent) return null
  return {
    essential: true,
    analytics: consent.analytics,
    acceptedAt: consent.acceptedAt,
  }
}

export function hasSiteConsent(): boolean {
  return getSiteConsent() !== null
}

/**
 * Whether the visitor has dismissed the cookie banner. This is intentionally
 * separate from the terms gate (`hasSiteConsent`) so the cookie banner still
 * appears after the entry consent modal instead of being silently skipped.
 */
export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_STORAGE_KEY) !== null
}

export function saveSiteConsent(analytics: boolean): void {
  const acceptedAt = new Date().toISOString()
  const consent: SiteConsent = {
    termsVersion: LEGAL_TERMS_VERSION,
    termsAccepted: true,
    essential: true,
    analytics,
    acceptedAt,
  }
  const cookiePrefs: CookiePreferences = {
    essential: true,
    analytics,
    acceptedAt,
  }
  if (typeof window === 'undefined') return
  // The single entry modal is the mandatory gate for ToS + Privacy + Cookies,
  // so cookie consent is recorded here — there is no separate cookie banner.
  localStorage.setItem(SITE_CONSENT_KEY, JSON.stringify(consent))
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookiePrefs))
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
  window.dispatchEvent(new CustomEvent(SITE_CONSENT_EVENT))
}

/** Records the cookie-banner choice and marks the banner as dismissed. */
export function saveCookiePreferences(analytics: boolean): void {
  if (typeof window === 'undefined') return
  const prefs: CookiePreferences = {
    essential: true,
    analytics,
    acceptedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs))
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
}
