import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['hr', 'en', 'de', 'it', 'es', 'sr'],
  defaultLocale: 'hr',
  localePrefix: 'as-needed',
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
