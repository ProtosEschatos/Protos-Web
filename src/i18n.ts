import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export const locales = routing.locales
export type Locale = (typeof locales)[number]
export const defaultLocale = routing.defaultLocale

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (routing.locales as readonly string[]).includes(value)
}

export const localeLabels: Record<Locale, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
  sr: 'Српски',
}

export const localeFlags: Record<Locale, string> = {
  hr: '\u{1F1ED}\u{1F1F7}',
  en: '\u{1F1EC}\u{1F1E7}',
  de: '\u{1F1E9}\u{1F1EA}',
  it: '\u{1F1EE}\u{1F1F9}',
  es: '\u{1F1EA}\u{1F1F8}',
  sr: '\u{1F1F7}\u{1F1F8}',
}

/** Locales rendered in Cyrillic script — used for html lang + font/script hints. */
export const CYRILLIC_LOCALES: readonly Locale[] = ['sr']

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = isLocale(requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
