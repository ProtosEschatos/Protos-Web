import type { TransitionDestinationKey } from '@/lib/routes/main-nav'

export type TransitionVariant = {
  primary: string
  secondary: string
  accent: string
  exitMotion: 'zoom-in' | 'slide-left' | 'shatter' | 'fold-up' | 'stream-up' | 'radar-in' | 'orbit-in'
  enterMotion: 'zoom-out' | 'slide-right' | 'assemble' | 'fold-down' | 'stream-down' | 'radar-out' | 'orbit-out'
  particleShape: 'stars' | 'rings' | 'nodes' | 'frames' | 'hex' | 'lines' | 'waves'
}

export const TRANSITION_VARIANTS: Record<TransitionDestinationKey, TransitionVariant> = {
  home: {
    primary: '#ff6600',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    exitMotion: 'zoom-in',
    enterMotion: 'zoom-out',
    particleShape: 'stars',
  },
  about: {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#c4b5fd',
    exitMotion: 'orbit-in',
    enterMotion: 'orbit-out',
    particleShape: 'rings',
  },
  process: {
    primary: '#ff6600',
    secondary: '#06b6d4',
    accent: '#8b5cf6',
    exitMotion: 'shatter',
    enterMotion: 'assemble',
    particleShape: 'nodes',
  },
  portfolio: {
    primary: '#6366f1',
    secondary: '#f59e0b',
    accent: '#818cf8',
    exitMotion: 'slide-left',
    enterMotion: 'slide-right',
    particleShape: 'frames',
  },
  services: {
    primary: '#06b6d4',
    secondary: '#8b5cf6',
    accent: '#22d3ee',
    exitMotion: 'fold-up',
    enterMotion: 'fold-down',
    particleShape: 'hex',
  },
  blog: {
    primary: '#ff8800',
    secondary: '#ff6600',
    accent: '#fbbf24',
    exitMotion: 'stream-up',
    enterMotion: 'stream-down',
    particleShape: 'lines',
  },
  contact: {
    primary: '#06b6d4',
    secondary: '#6366f1',
    accent: '#67e8f9',
    exitMotion: 'radar-in',
    enterMotion: 'radar-out',
    particleShape: 'waves',
  },
}

export function getTransitionVariant(key: TransitionDestinationKey | null): TransitionVariant {
  if (!key) return TRANSITION_VARIANTS.home
  return TRANSITION_VARIANTS[key]
}
