import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export const locales = routing.locales
export type Locale = (typeof locales)[number]
export const defaultLocale = routing.defaultLocale

export const localeLabels: Record<Locale, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
}

export const localeFlags: Record<Locale, string> = {
  hr: '\u{1F1ED}\u{1F1F7}',
  en: '\u{1F1EC}\u{1F1E7}',
  de: '\u{1F1E9}\u{1F1EA}',
  it: '\u{1F1EE}\u{1F1F9}',
  es: '\u{1F1EA}\u{1F1F8}',
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
