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

/**
 * Primary + secondary layer so every card combines two different effects.
 *
 * Strides 5 and 7 are coprime to 12, so consecutive cards cycle through ALL
 * twelve effects (a full permutation) instead of always reusing the first few.
 * Even a small section of 4–6 cards now shows widely-different effects, and the
 * primary never collides with its layer.
 */
export function getCardEffectClasses(index: number): string {
  const n = CARD_EFFECTS.length
  const i = ((index % n) + n) % n
  const primary = CARD_EFFECTS[(i * 5) % n]
  const layer = CARD_EFFECTS[(i * 7 + 3) % n]
  return `fx-${primary} fx-layer-${layer}`
}
