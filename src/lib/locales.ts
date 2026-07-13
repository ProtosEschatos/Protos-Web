/**
 * Single source of truth for public site locales.
 * Used by next-intl routing, middleware matchers, and admin path detection.
 */
export const SITE_LOCALES = ['hr', 'en', 'de', 'it', 'es', 'sr'] as const

export type SiteLocaleCode = (typeof SITE_LOCALES)[number]

export const SITE_DEFAULT_LOCALE: SiteLocaleCode = 'hr'
