'use client'

import { Stars } from '@react-three/drei'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'
import { BACKGROUND_FOG } from '@/lib/site-background-routes'

export default function HomeBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.home} showGlow={false}>
      <Stars radius={90} depth={60} count={isMobile ? 1200 : 2200} factor={2.2} saturation={0} fade speed={0.35} />
    </AmbientBackgroundShell>
  )
}
