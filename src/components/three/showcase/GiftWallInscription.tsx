'use client'

import { Html } from '@react-three/drei'
import { SHOWCASE_CONFIG } from './constants'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { GIFT_PORTAL_INSCRIPTION } from '@/lib/showcase/featured-demo'

type Props = {
  viewport: ShowcaseViewport
}

/** Large neon inscription on the back wall above the System Boost poklon frame. */
export function GiftWallInscription({ viewport }: Props) {
  const { galleryLength, galleryHeight } = SHOWCASE_CONFIG
  const compact = viewport === 'mobile'
  const z = -galleryLength / 2 + 0.06

  return (
    <Html
      transform
      occlude
      distanceFactor={compact ? 3.2 : 2.6}
      position={[0, galleryHeight * 0.74, z]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ width: compact ? 280 : 520 }}
      >
        <p
          className={`${compact ? 'text-[2rem]' : 'text-[3.25rem]'} font-light leading-none tracking-[0.06em] text-[#67e8f9]`}
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            textShadow:
              '0 0 24px rgba(103,232,249,0.95), 0 0 48px rgba(6,182,212,0.65), 0 0 80px rgba(6,182,212,0.35)',
          }}
        >
          {GIFT_PORTAL_INSCRIPTION.line1}
        </p>
        <p
          className={`${compact ? 'mt-2 text-[1.65rem]' : 'mt-3 text-[2.75rem]'} font-light leading-none tracking-[0.06em] text-[#67e8f9]`}
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            textShadow:
              '0 0 24px rgba(103,232,249,0.95), 0 0 48px rgba(6,182,212,0.65), 0 0 80px rgba(6,182,212,0.35)',
          }}
        >
          {GIFT_PORTAL_INSCRIPTION.line2}
        </p>
      </div>
    </Html>
  )
}
