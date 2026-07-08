import type { CSSProperties } from 'react'

/**
 * Design board PNGs — canonical copy in design/references/boards/, served live from
 * Supabase design-assets (public bucket). Sync via scripts/sync-design-boards.mjs
 * or `supabase storage cp --experimental --linked`.
 */

const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://laqnnzavwbojntfiqmxj.supabase.co'

/** Per-route page backdrop board categories (from Desktop library). */
export const ROUTE_DESIGN_BACKGROUNDS: Record<
  string,
  { hero: string; pattern: string; lighting: string }
> = {
  home: {
    hero: 'hero-backgrounds',
    pattern: 'animated-bg-patterns',
    lighting: 'lighting-backgrounds',
  },
  about: {
    hero: 'about-assets',
    pattern: 'parallax-layers',
    lighting: 'lighting-backgrounds',
  },
  process: {
    hero: 'hero-backgrounds',
    pattern: 'scroll-animations',
    lighting: 'lighting-backgrounds',
  },
  portfolio: {
    hero: 'hero-backgrounds',
    pattern: 'animated-bg-patterns',
    lighting: 'parallax-layers',
  },
  services: {
    hero: 'service-icons',
    pattern: 'card-layouts',
    lighting: 'lighting-backgrounds',
  },
  blog: {
    hero: 'blog-ui',
    pattern: 'animated-bg-patterns',
    lighting: 'lighting-backgrounds',
  },
  contact: {
    hero: 'modals',
    pattern: 'parallax-layers',
    lighting: 'lighting-backgrounds',
  },
}

/** All primary board categories (source_board keys). */
export const DESIGN_BOARD_KEYS = [
  'about-assets',
  'animated-bg-patterns',
  'blog-ui',
  'buttons',
  'card-bg-textures',
  'card-hover',
  'card-hover-themes',
  'card-layouts',
  'dividers',
  'hero-backgrounds',
  'icon-badges',
  'lighting-backgrounds',
  'loaders',
  'modals',
  'navigation',
  'page-transitions',
  'parallax-layers',
  'scroll-animations',
  'service-icons',
  'text-animations',
] as const

export type DesignBoardKey = (typeof DESIGN_BOARD_KEYS)[number]

/** @deprecated Use getDesignBoardStorageUrl — site no longer serves boards from Vercel. */
export function getDesignBoardUrl(sourceBoard: string): string {
  return getDesignBoardStorageUrl(sourceBoard)
}

/** Public Supabase Storage URL for a design board PNG. */
export function getDesignBoardStorageUrl(sourceBoard: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/design-assets/boards/${sourceBoard}.png`
}

/** Absolute board image URL for CSS backgrounds (Supabase CDN). */
export function getDesignBoardPath(sourceBoard: string): string {
  return getDesignBoardStorageUrl(sourceBoard)
}

export type RouteBoardStack = {
  hero: string
  pattern: string
  lighting: string
}

export function getRouteBoardStack(routeKey: string): RouteBoardStack {
  return ROUTE_DESIGN_BACKGROUNDS[routeKey] ?? ROUTE_DESIGN_BACKGROUNDS.home
}

/** 8 card textures — grid positions on card-bg-textures.png (4×2). */
export const CARD_TEXTURE_GRID: { col: number; row: number; cols: number; rows: number }[] = [
  { col: 0, row: 0, cols: 4, rows: 2 },
  { col: 1, row: 0, cols: 4, rows: 2 },
  { col: 2, row: 0, cols: 4, rows: 2 },
  { col: 3, row: 0, cols: 4, rows: 2 },
  { col: 0, row: 1, cols: 4, rows: 2 },
  { col: 1, row: 1, cols: 4, rows: 2 },
  { col: 2, row: 1, cols: 4, rows: 2 },
  { col: 3, row: 1, cols: 4, rows: 2 },
]

export function getCardTextureStyle(index: number): CSSProperties {
  const grid = CARD_TEXTURE_GRID[index % CARD_TEXTURE_GRID.length]
  const x = (grid.col / (grid.cols - 1)) * 100
  const y = (grid.row / (grid.rows - 1)) * 100
  return {
    backgroundImage: `url(${getDesignBoardPath('card-bg-textures')})`,
    backgroundSize: `${grid.cols * 100}% ${grid.rows * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  }
}

/** 17 hovers — grid on card-hover.png (approx 6×3). */
export function getCardHoverStyle(index: number): CSSProperties {
  const cols = 6
  const rows = 3
  const i = index % 17
  const col = i % cols
  const row = Math.floor(i / cols)
  const x = cols > 1 ? (col / (cols - 1)) * 100 : 0
  const y = rows > 1 ? (row / (rows - 1)) * 100 : 0
  return {
    backgroundImage: `url(${getDesignBoardPath('card-hover')})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  }
}
