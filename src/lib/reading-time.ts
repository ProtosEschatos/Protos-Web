/** Rough reading-time estimate in whole minutes (min 1) at ~200 wpm. */
export function estimateReadingMinutes(content: string | null | undefined): number {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 1
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}
