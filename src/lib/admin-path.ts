import { routing } from '@/routing'

/** Locale-aware admin path — hr bez prefiksa, ostali s /en/admin itd. */
export function adminHref(href: string, locale: string): string {
  if (!href.startsWith('/')) return href
  if (locale === routing.defaultLocale) return href
  return `/${locale}${href}`
}
