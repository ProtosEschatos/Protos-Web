import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { SITE_DEFAULT_LOCALE, SITE_LOCALES } from '@/lib/locales'

export const routing = defineRouting({
  locales: [...SITE_LOCALES],
  defaultLocale: SITE_DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
