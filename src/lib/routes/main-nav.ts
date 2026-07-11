import { normalizeSitePath } from '@/lib/showcase/site-background-routes'
import { ABOUT_INTERNAL_HREF, aboutPathForLocale, isAboutPath } from '@/lib/routes/localized-paths'

/** Javni navbar — jedini izvor istine za Header, MobileMenu i page transitions. */
export const MAIN_NAV_ITEMS = [
  { href: '/', key: 'home' },
  { href: '/o-meni', key: 'about' },
  { href: '/proces', key: 'process' },
  { href: '/portfolio', key: 'portfolio' },
  { href: '/usluge', key: 'services' },
  { href: '/blog', key: 'blog' },
] as const

export type MainNavKey = (typeof MAIN_NAV_ITEMS)[number]['key']

export const MAIN_NAV_PATHS = [
  ...MAIN_NAV_ITEMS.map((item) => item.href),
  '/kontakt',
] as const

export type MainNavPath = (typeof MAIN_NAV_PATHS)[number]

export type TransitionDestinationKey = MainNavKey | 'contact'

export function normalizeHref(href: string): string {
  const withoutQuery = href.split('?')[0].split('#')[0]
  return normalizeSitePath(withoutQuery || '/')
}

export function isMainNavHref(href: string): boolean {
  const path = normalizeHref(href)
  return (MAIN_NAV_PATHS as readonly string[]).includes(path)
}

export function navPublicHref(key: MainNavKey | 'contact', locale: string): string {
  if (key === 'about') return aboutPathForLocale(locale)
  if (key === 'contact') return '/kontakt'
  const item = MAIN_NAV_ITEMS.find((entry) => entry.key === key)
  return item?.href ?? '/'
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (href === ABOUT_INTERNAL_HREF && isAboutPath(pathname)) return true
  return false
}

export function getTransitionDestinationKey(href: string): TransitionDestinationKey {
  const path = normalizeHref(href)

  if (path === '/') return 'home'
  if (path === ABOUT_INTERNAL_HREF || isAboutPath(path)) return 'about'
  if (path === '/proces') return 'process'
  if (path === '/portfolio') return 'portfolio'
  if (path === '/usluge') return 'services'
  if (path === '/blog') return 'blog'
  if (path === '/kontakt') return 'contact'
  return 'home'
}
