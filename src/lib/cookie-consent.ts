export const COOKIE_STORAGE_KEY = 'protos-cookies'

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
}

export function hasCookieConsent(): boolean {
  return getCookiePreferences() !== null
}

/** @deprecated use saveCookiePreferences */
export function acceptCookieConsent(): void {
  saveCookiePreferences(false)
}
