export type BackgroundRouteKey =
  | 'home'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'services'
  | 'blog'
  | 'contact'

export type PageBackgroundProps = {
  isMobile?: boolean
}

const LOCALE_PREFIXES = ['hr', 'en', 'de', 'it', 'es'] as const

export function normalizeSitePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return '/'
  if ((LOCALE_PREFIXES as readonly string[]).includes(segments[0])) {
    const rest = segments.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function getBackgroundKey(pathname: string): BackgroundRouteKey {
  const path = normalizeSitePath(pathname)

  if (path === '/') return 'home'
  if (path.startsWith('/o-meni')) return 'about'
  if (path.startsWith('/proces')) return 'process'
  if (path.startsWith('/portfolio')) return 'portfolio'
  if (path.startsWith('/usluge')) return 'services'
  if (path.startsWith('/blog')) return 'blog'
  if (path.startsWith('/kontakt')) return 'contact'

  return 'home'
}

export const BACKGROUND_FALLBACKS: Record<BackgroundRouteKey, string> = {
  home: 'radial-gradient(ellipse at 50% 40%, rgba(255,102,0,0.1) 0%, transparent 55%)',
  about: 'radial-gradient(ellipse at 40% 50%, rgba(139,92,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(6,182,212,0.08) 0%, transparent 50%)',
  process: 'radial-gradient(ellipse at 30% 50%, rgba(255,102,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.12) 0%, transparent 55%)',
  portfolio: 'radial-gradient(ellipse at 50% 45%, rgba(99,102,241,0.14) 0%, transparent 60%)',
  services: 'radial-gradient(ellipse at 55% 50%, rgba(6,182,212,0.12) 0%, transparent 55%)',
  blog: 'radial-gradient(ellipse at 45% 40%, rgba(255,136,0,0.1) 0%, transparent 50%), radial-gradient(ellipse at 65% 60%, rgba(139,92,246,0.08) 0%, transparent 50%)',
  contact: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.14) 0%, transparent 60%)',
}
