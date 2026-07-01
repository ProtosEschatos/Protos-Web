import { normalizeSitePath } from '@/lib/site-background-routes'

export const MAIN_NAV_PATHS = [
  '/',
  '/o-meni',
  '/proces',
  '/portfolio',
  '/usluge',
  '/blog',
  '/kontakt',
] as const

export type MainNavPath = (typeof MAIN_NAV_PATHS)[number]

export type TransitionDestinationKey =
  | 'home'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'services'
  | 'blog'
  | 'contact'

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
