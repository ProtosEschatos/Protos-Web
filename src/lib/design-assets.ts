import type { CSSProperties } from 'react'

/**
 * Design board PNGs — canonical copy in design/references/boards/, served live from
 * Supabase design-assets (public bucket). Sync via scripts/sync-design-boards.mjs
 * or `supabase storage cp --experimental --linked`.
 */

const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://laqnnzavwbojntfiqmxj.supabase.co'

export type RouteSceneBackground = {
  /** Primary board in design-assets/boards/ */
  source: 'board' | 'extra'
  /** Board key (e.g. hero-backgrounds) or extras filename */
  path: string
  /** Crop one panel from a multi-hero reference sheet (4×2, 4×3, etc.) */
  crop?: { cols: number; rows: number; col: number; row: number }
}

/**
 * Per-route full-page scene — real hero/scene PNGs from Desktop "Za Protos Web",
 * NOT UI kit boards (about-us elements, service icons, modals, etc.).
 */
export const ROUTE_SCENE_BACKGROUNDS: Record<string, RouteSceneBackground> = {
  home: {
    source: 'board',
    path: 'hero-backgrounds',
  },
  about: {
    source: 'extra',
    path: 'hero-header-backgrounds-set.png',
    crop: { cols: 4, rows: 2, col: 3, row: 0 },
  },
  process: {
    source: 'extra',
    path: 'wireframe-portal-background.png',
  },
  portfolio: {
    source: 'extra',
    path: 'Ultra-dynamic_3D_abstract_geometric_shapes_morphin-1783481047770.png',
  },
  services: {
    source: 'extra',
    path: 'hero-header-backgrounds-set.png',
    crop: { cols: 4, rows: 2, col: 1, row: 1 },
  },
  blog: {
    source: 'extra',
    path: 'hero-header-backgrounds-set.png',
    crop: { cols: 4, rows: 2, col: 0, row: 1 },
  },
  contact: {
    source: 'extra',
    path: 'hero-header-backgrounds-set.png',
    crop: { cols: 4, rows: 2, col: 2, row: 1 },
  },
}

/** @deprecated UI-kit board stack — do not use for page backgrounds */
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

/** Public Supabase Storage URL for an extras board PNG. */
export function getDesignBoardExtraUrl(filename: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/design-assets/boards/extras/${filename}`
}

/** Absolute board image URL for CSS backgrounds (Supabase CDN). */
export function getDesignBoardPath(sourceBoard: string): string {
  return getDesignBoardStorageUrl(sourceBoard)
}

export function getRouteSceneBackground(routeKey: string): RouteSceneBackground {
  return ROUTE_SCENE_BACKGROUNDS[routeKey] ?? ROUTE_SCENE_BACKGROUNDS.home
}

export function getSceneBackgroundUrl(scene: RouteSceneBackground): string {
  return scene.source === 'extra'
    ? getDesignBoardExtraUrl(scene.path)
    : getDesignBoardStorageUrl(scene.path)
}

export function getSceneBackgroundStyles(scene: RouteSceneBackground): CSSProperties {
  const url = getSceneBackgroundUrl(scene)
  if (!scene.crop) {
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  const { cols, rows, col, row } = scene.crop
  const x = cols > 1 ? (col / (cols - 1)) * 100 : 0
  const y = rows > 1 ? (row / (rows - 1)) * 100 : 0
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
    backgroundRepeat: 'no-repeat',
  }
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
