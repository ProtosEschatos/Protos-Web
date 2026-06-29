import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Supported locales
export const locales = ['hr', 'en', 'de', 'it', 'es'] as const
export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'hr'

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
}

// Locale flags for UI
export const localeFlags: Record<Locale, string> = {
  hr: '\u{1F1ED}\u{1F1F7}',
  en: '\u{1F1EC}\u{1F1E7}',
  de: '\u{1F1E9}\u{1F1EA}',
  it: '\u{1F1EE}\u{1F1F9}',
  es: '\u{1F1EA}\u{1F1F8}',
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
