export const COOKIE_STORAGE_KEY = 'protos-cookies'

export function acceptCookieConsent(): void {
  localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted')
}
