/** Twelve hover effect presets — each card gets a primary + layered combo. */
export const CARD_EFFECTS = [
  'crimson-lift',
  'emerald-tilt',
  'ocean-float',
  'galaxy-expand',
  'sunset-glow',
  'ice-frost',
  'matrix-scan',
  'neon-pulse',
  'hologram-glitch',
  'magnetic-attract',
  'liquid-spread',
  'particle-trail',
] as const

export type CardEffect = (typeof CARD_EFFECTS)[number]

/** Primary + secondary layer so every card combines two different effects. */
export function getCardEffectClasses(index: number): string {
  const primary = CARD_EFFECTS[index % CARD_EFFECTS.length]
  const layer = CARD_EFFECTS[(index + 5) % CARD_EFFECTS.length]
  return `fx-${primary} fx-layer-${layer}`
}
