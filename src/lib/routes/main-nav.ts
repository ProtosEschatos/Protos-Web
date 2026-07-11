import { normalizeSitePath } from '@/lib/showcase/site-background-routes'

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

export function getTransitionDestinationKey(href: string): TransitionDestinationKey {
  const path = normalizeHref(href)

  switch (path) {
    case '/':
      return 'home'
    case '/o-meni':
      return 'about'
    case '/proces':
      return 'process'
    case '/portfolio':
      return 'portfolio'
    case '/usluge':
      return 'services'
    case '/blog':
      return 'blog'
    case '/kontakt':
      return 'contact'
    default:
      return 'home'
  }
}
