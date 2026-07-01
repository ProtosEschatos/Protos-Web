export const COOKIE_STORAGE_KEY = 'protos-cookies'

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_STORAGE_KEY) === 'accepted'
}

export function acceptCookieConsent(): void {
  localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted')
}
