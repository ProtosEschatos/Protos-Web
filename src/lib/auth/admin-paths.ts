import { SITE_DEFAULT_LOCALE, SITE_LOCALES } from '@/lib/locales'

/** Default locale uses unprefixed admin URLs (`/admin`, not `/hr/admin`). */
export const ADMIN_DEFAULT_LOCALE = SITE_DEFAULT_LOCALE

/**
 * Locales that appear as the first URL segment (next-intl `localePrefix: as-needed`).
 */
export const ADMIN_PREFIXED_LOCALES = SITE_LOCALES.filter(
  (locale) => locale !== ADMIN_DEFAULT_LOCALE,
)

/** Regex alternation for prefixed paths, e.g. `en|de|it|es|sr`. */
export function adminPrefixedLocalePattern(): string {
  return ADMIN_PREFIXED_LOCALES.join('|')
}

/** All site locales for Next.js middleware matcher, e.g. `hr|en|de|it|es|sr`. */
export function allLocalesMatcherPattern(): string {
  return SITE_LOCALES.join('|')
}

export function normalizePathname(pathname: string): string {
  return pathname.split('?')[0].split('#')[0]
}

export function isAdminPath(pathname: string): boolean {
  const path = normalizePathname(pathname)
  if (path === '/admin' || path.startsWith('/admin/')) return true
  const locales = adminPrefixedLocalePattern()
  return new RegExp(`^/(${locales})/admin(/|$)`).test(path)
}

export function isAdminLoginPath(pathname: string): boolean {
  const path = normalizePathname(pathname)
  if (path === '/admin/login') return true
  const locales = adminPrefixedLocalePattern()
  return new RegExp(`^/(${locales})/admin/login$`).test(path)
}

/** Inline boot-gate script: prefixed admin segment for `new RegExp`. */
export function adminPrefixedLocaleRegexSource(): string {
  return adminPrefixedLocalePattern()
}
