import { LEGAL_TERMS_VERSION } from '@/lib/site'

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

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(COOKIE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CookiePreferences
    if (parsed?.essential === true) return parsed
  } catch {
    return null
  }
  return null
}

export function hasSiteConsent(): boolean {
  return getSiteConsent() !== null
}

export function hasCookieConsent(): boolean {
  return getCookiePreferences() !== null
}

/** TOS + essential cookies — does not close the separate cookie banner step. */
export function saveSiteTermsConsent(): void {
  const acceptedAt = new Date().toISOString()
  const existing = getSiteConsent()
  const consent: SiteConsent = {
    termsVersion: LEGAL_TERMS_VERSION,
    termsAccepted: true,
    essential: true,
    analytics: existing?.analytics ?? false,
    acceptedAt,
  }
  localStorage.setItem(SITE_CONSENT_KEY, JSON.stringify(consent))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SITE_CONSENT_EVENT))
  }
}

export function saveCookiePreferences(analytics: boolean): void {
  const acceptedAt = new Date().toISOString()
  const cookiePrefs: CookiePreferences = {
    essential: true,
    analytics,
    acceptedAt,
  }
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookiePrefs))

  const site = getSiteConsent()
  if (site) {
    localStorage.setItem(
      SITE_CONSENT_KEY,
      JSON.stringify({ ...site, analytics, acceptedAt }),
    )
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
  }
}

/** @deprecated Use saveSiteTermsConsent + saveCookiePreferences */
export function saveSiteConsent(analytics: boolean): void {
  saveSiteTermsConsent()
  saveCookiePreferences(analytics)
}
