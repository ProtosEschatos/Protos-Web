'use client'

/**
 * Flat site backdrop — no photo layers, patterns, or animated backgrounds.
 */
export default function SiteBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-[var(--dark)]"
      aria-hidden
    />
  )
}
