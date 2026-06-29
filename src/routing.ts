import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['hr', 'en', 'de', 'it', 'es'],
  defaultLocale: 'hr',
  localePrefix: 'as-needed',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
