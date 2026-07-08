'use client'

import { usePathname } from '@/routing'
import { getBackgroundKey } from '@/lib/site-background-routes'
import { getRouteBoardStack, getDesignBoardPath } from '@/lib/design-assets'

/**
 * Page backdrop from real design board PNGs (Desktop "Za Protos Web" library).
 */
export default function LibraryBackdrop() {
  const pathname = usePathname()
  const routeKey = getBackgroundKey(pathname)
  const stack = getRouteBoardStack(routeKey)

  const layers = [
    { key: 'hero', board: stack.hero, opacity: 0.92, blend: 'normal' as const },
    { key: 'pattern', board: stack.pattern, opacity: 0.45, blend: 'screen' as const },
    { key: 'lighting', board: stack.lighting, opacity: 0.55, blend: 'soft-light' as const },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0a1a]" />
      {layers.map((layer) => (
        <div
          key={`${routeKey}-${layer.key}`}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url(${getDesignBoardPath(layer.board)})`,
            opacity: layer.opacity,
            mixBlendMode: layer.blend,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,26,0.55) 0%, rgba(10,10,26,0.25) 45%, rgba(10,10,26,0.75) 100%)',
        }}
      />
    </div>
  )
}
