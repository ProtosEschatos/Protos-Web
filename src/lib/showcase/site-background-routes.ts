import { isAboutPath } from '@/lib/routes/localized-paths'

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
  if (path.startsWith('/o-meni') || isAboutPath(path)) return 'about'
  if (path.startsWith('/proces')) return 'process'
  if (path.startsWith('/portfolio')) return 'portfolio'
  if (path.startsWith('/usluge')) return 'services'
  if (path.startsWith('/blog')) return 'blog'
  if (path.startsWith('/kontakt')) return 'contact'

  return 'home'
}

export const BACKGROUND_GLOW: Record<BackgroundRouteKey, string> = {
  home: '#ff6600',
  about: '#a78bfa',
  process: '#ff8800',
  portfolio: '#6366f1',
  services: '#22d3ee',
  blog: '#f59e0b',
  contact: '#06b6d4',
}

export const BACKGROUND_FALLBACKS: Record<BackgroundRouteKey, string> = {
  home: 'transparent',
  about: 'radial-gradient(ellipse at 35% 45%, rgba(139,92,246,0.38) 0%, transparent 58%), radial-gradient(ellipse at 72% 28%, rgba(6,182,212,0.28) 0%, transparent 52%)',
  process: 'radial-gradient(ellipse at 28% 50%, rgba(255,102,0,0.34) 0%, transparent 55%), radial-gradient(ellipse at 72% 48%, rgba(139,92,246,0.32) 0%, transparent 55%)',
  portfolio: 'radial-gradient(ellipse at 50% 42%, rgba(99,102,241,0.38) 0%, transparent 62%)',
  services: 'radial-gradient(ellipse at 55% 48%, rgba(6,182,212,0.36) 0%, transparent 58%)',
  blog: 'radial-gradient(ellipse at 42% 38%, rgba(255,136,0,0.32) 0%, transparent 52%), radial-gradient(ellipse at 68% 62%, rgba(139,92,246,0.26) 0%, transparent 52%)',
  contact: 'radial-gradient(ellipse at 50% 48%, rgba(6,182,212,0.4) 0%, transparent 62%)',
}

export type AmbientBlob = {
  color: string
  size: string
  position: string
  animation: 'ambient-drift-a' | 'ambient-drift-b' | 'ambient-drift-c' | 'ambient-pulse'
  delay?: string
}

export const BACKGROUND_AMBIENT: Record<BackgroundRouteKey, AmbientBlob[]> = {
  home: [
    { color: 'rgba(255,102,0,0.22)', size: 'min(42vw, 28rem)', position: 'top-[8%] left-[12%]', animation: 'ambient-drift-a' },
    { color: 'rgba(139,92,246,0.14)', size: 'min(36vw, 22rem)', position: 'bottom-[18%] right-[8%]', animation: 'ambient-drift-b', delay: '-4s' },
    { color: 'rgba(6,182,212,0.1)', size: 'min(28vw, 18rem)', position: 'top-[45%] right-[30%]', animation: 'ambient-pulse', delay: '-2s' },
  ],
  about: [
    { color: 'rgba(139,92,246,0.24)', size: 'min(40vw, 26rem)', position: 'top-[15%] left-[20%]', animation: 'ambient-drift-c' },
    { color: 'rgba(6,182,212,0.16)', size: 'min(32vw, 20rem)', position: 'bottom-[12%] right-[15%]', animation: 'ambient-drift-a', delay: '-3s' },
    { color: 'rgba(251,191,36,0.1)', size: 'min(20vw, 14rem)', position: 'top-[55%] left-[55%]', animation: 'ambient-pulse', delay: '-1s' },
  ],
  process: [
    { color: 'rgba(255,102,0,0.2)', size: 'min(38vw, 24rem)', position: 'top-[20%] left-[5%]', animation: 'ambient-drift-b' },
    { color: 'rgba(139,92,246,0.18)', size: 'min(34vw, 22rem)', position: 'bottom-[20%] right-[10%]', animation: 'ambient-drift-c', delay: '-5s' },
    { color: 'rgba(129,140,248,0.12)', size: 'min(24vw, 16rem)', position: 'top-[40%] right-[40%]', animation: 'ambient-pulse' },
  ],
  portfolio: [
    { color: 'rgba(99,102,241,0.22)', size: 'min(44vw, 28rem)', position: 'top-[10%] left-[30%]', animation: 'ambient-drift-a' },
    { color: 'rgba(6,182,212,0.14)', size: 'min(30vw, 20rem)', position: 'bottom-[15%] left-[10%]', animation: 'ambient-drift-b', delay: '-2s' },
    { color: 'rgba(245,158,11,0.12)', size: 'min(22vw, 15rem)', position: 'top-[60%] right-[12%]', animation: 'ambient-pulse', delay: '-3s' },
  ],
  services: [
    { color: 'rgba(6,182,212,0.22)', size: 'min(40vw, 26rem)', position: 'top-[12%] right-[18%]', animation: 'ambient-drift-c' },
    { color: 'rgba(139,92,246,0.14)', size: 'min(32vw, 21rem)', position: 'bottom-[22%] left-[15%]', animation: 'ambient-drift-a', delay: '-4s' },
    { color: 'rgba(255,102,0,0.1)', size: 'min(26vw, 17rem)', position: 'top-[50%] left-[45%]', animation: 'ambient-pulse' },
  ],
  blog: [
    { color: 'rgba(255,136,0,0.2)', size: 'min(38vw, 25rem)', position: 'top-[18%] left-[18%]', animation: 'ambient-drift-b' },
    { color: 'rgba(139,92,246,0.15)', size: 'min(34vw, 22rem)', position: 'bottom-[10%] right-[20%]', animation: 'ambient-drift-c', delay: '-3s' },
    { color: 'rgba(255,200,100,0.08)', size: 'min(50vw, 32rem)', position: 'top-[35%] right-[5%]', animation: 'ambient-pulse', delay: '-1s' },
  ],
  contact: [
    { color: 'rgba(6,182,212,0.24)', size: 'min(42vw, 28rem)', position: 'top-[25%] left-[25%]', animation: 'ambient-pulse' },
    { color: 'rgba(139,92,246,0.14)', size: 'min(30vw, 20rem)', position: 'bottom-[18%] right-[18%]', animation: 'ambient-drift-a', delay: '-2s' },
    { color: 'rgba(34,211,238,0.1)', size: 'min(24vw, 16rem)', position: 'top-[55%] right-[35%]', animation: 'ambient-drift-b', delay: '-5s' },
  ],
}

export const BACKGROUND_FOG: Record<BackgroundRouteKey, string> = {
  home: '#0a0818',
  about: '#0c0820',
  process: '#100818',
  portfolio: '#080818',
  services: '#061018',
  blog: '#120a08',
  contact: '#061218',
}
