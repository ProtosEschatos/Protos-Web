export const COOKIE_STORAGE_KEY = 'protos-cookies'
export const COOKIE_CONSENT_EVENT = 'protos-cookie-consent-updated'

export type CookiePreferences = {
  essential: true
  analytics: boolean
  acceptedAt: string
}

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(COOKIE_STORAGE_KEY)
  if (!raw) return null
  if (raw === 'accepted') {
    return { essential: true, analytics: false, acceptedAt: '' }
  }
  try {
    const parsed = JSON.parse(raw) as CookiePreferences
    if (parsed?.essential) return parsed
  } catch {
    return null
  }
  return null
}

export function saveCookiePreferences(analytics: boolean): void {
  const prefs: CookiePreferences = {
    essential: true,
    analytics,
    acceptedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT))
  }
}

export function hasCookieConsent(): boolean {
  return getCookiePreferences() !== null
}
