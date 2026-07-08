/**
 * Design element library — names mirror `public.design_elements` (design/references/README.md).
 * Visual implementations live in src/styles/design-library/*.css
 */

/** card-bg-textures (8) */
export const CARD_TEXTURES = [
  'neon_laser_grid',
  'quantum_particle_field',
  'metallic_accordion',
  'holographic_data_stream',
  'crystalline_ice',
  'flowing_lava_plasma',
  'geometric_mandala',
  'glitch_hologram',
] as const

/** card-hover (17) — primary interaction per card */
export const CARD_HOVERS = [
  'lift_with_shadow',
  'tilt_3d',
  'expand_borders',
  'particle_burst',
  'glow_pulse',
  'frosted_glass_spread',
  'flip_card',
  'scale_with_blur',
  'shine_effect',
  'magnetic_pull',
  'liquid_spread',
  'neon_border',
  'glass_crack',
  'hologram_glitch',
  'rotation_orbit',
  'gradient_shift',
  'neon_outline_pulse',
] as const

export type CardTexture = (typeof CARD_TEXTURES)[number]
export type CardHover = (typeof CARD_HOVERS)[number]

export function toLibSlug(name: string): string {
  return name.replace(/_/g, '-')
}

/**
 * Each card gets a unique texture + hover from the library catalog.
 * Stride 5 on textures, 7 on hovers → full variety even in small grids.
 */
export function getCardLibraryClasses(index: number): string {
  const ti = ((index % CARD_TEXTURES.length) + CARD_TEXTURES.length) % CARD_TEXTURES.length
  const hi = ((index * 7 + 3) % CARD_HOVERS.length + CARD_HOVERS.length) % CARD_HOVERS.length
  const texture = CARD_TEXTURES[(ti * 5) % CARD_TEXTURES.length]
  const hover = CARD_HOVERS[hi]
  return `lib-tex-${toLibSlug(texture)} lib-hover-${toLibSlug(hover)}`
}

/** Per-route background stack from hero-backgrounds + animated-bg-patterns + lighting-backgrounds */
export type LibraryBackgroundStack = {
  hero: string
  pattern: string
  lighting: string
}

export const ROUTE_LIBRARY_BACKGROUNDS: Record<string, LibraryBackgroundStack> = {
  home: {
    hero: 'hero_space_bg',
    pattern: 'particle_field',
    lighting: 'glow_orbs',
  },
  about: {
    hero: 'aurora_hero',
    pattern: 'aurora_borealis',
    lighting: 'aurora_lights',
  },
  process: {
    hero: 'tunnel_grid',
    pattern: 'circuit_pattern',
    lighting: 'light_rays',
  },
  portfolio: {
    hero: 'neon_tunnel',
    pattern: 'holographic_grid',
    lighting: 'neon_glow',
  },
  services: {
    hero: 'grid_perspective',
    pattern: 'grid_lines',
    lighting: 'spotlight',
  },
  blog: {
    hero: 'purple_galaxy',
    pattern: 'starfield',
    lighting: 'ambient_glow',
  },
  contact: {
    hero: 'teal_particles',
    pattern: 'wave_gradient',
    lighting: 'lens_flare',
  },
}

export function getRouteBackgroundStack(routeKey: string): LibraryBackgroundStack {
  return ROUTE_LIBRARY_BACKGROUNDS[routeKey] ?? ROUTE_LIBRARY_BACKGROUNDS.home
}

export function getLibraryBgClasses(stack: LibraryBackgroundStack): string {
  return [
    `lib-bg-hero-${toLibSlug(stack.hero)}`,
    `lib-bg-pattern-${toLibSlug(stack.pattern)}`,
    `lib-bg-light-${toLibSlug(stack.lighting)}`,
  ].join(' ')
}
