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

/** @deprecated Use hasSiteConsent */
export function hasCookieConsent(): boolean {
  return hasSiteConsent()
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
  localStorage.setItem(SITE_CONSENT_KEY, JSON.stringify(consent))
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookiePrefs))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
    window.dispatchEvent(new CustomEvent(SITE_CONSENT_EVENT))
  }
}

/** @deprecated Use saveSiteConsent */
export function saveCookiePreferences(analytics: boolean): void {
  saveSiteConsent(analytics)
}
