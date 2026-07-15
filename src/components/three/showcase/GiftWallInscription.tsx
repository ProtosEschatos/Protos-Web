'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { GIFT_WALL_INSCRIPTION } from '@/lib/showcase/featured-demo'
import { getBackWallTriptychLayout } from './backWallTriptych'
import { buildTwoLineNeonTexture } from './neonTextTexture'

type NeonPanelProps = {
  lines: readonly [string, string]
  position: [number, number, number]
  planeW: number
  planeH: number
  fontSize: number
}

function NeonInscriptionPanel({ lines, position, planeW, planeH, fontSize }: NeonPanelProps) {
  const texture = useMemo(
    () => buildTwoLineNeonTexture(lines[0], lines[1], fontSize),
    [lines, fontSize],
  )

  return (
    <group position={position}>
      <mesh renderOrder={50}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  )
}

type Props = {
  viewport: ShowcaseViewport
}

/** Back wall triptych: Astra Castra (left) | poklon (center) | Numen Lumen (right). */
export function GiftWallInscription({ viewport }: Props) {
  const layout = getBackWallTriptychLayout(viewport)
  const fontSize = viewport === 'mobile' ? 128 : 192

  return (
    <group>
      <mesh position={[0, layout.centerY, layout.z - 0.02]} renderOrder={18}>
        <planeGeometry args={[layout.bandW, layout.bandH]} />
        <meshStandardMaterial
          color={0x0b1224}
          emissive={0x061018}
          emissiveIntensity={0.35}
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {layout.dividerX.map((x) => (
        <mesh key={x} position={[x, layout.centerY, layout.textZ - 0.01]} renderOrder={19}>
          <planeGeometry args={[0.04, layout.bandH * 0.92]} />
          <meshBasicMaterial color={0x22d3ee} transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}

      <NeonInscriptionPanel
        lines={GIFT_WALL_INSCRIPTION.left}
        position={[layout.leftX, layout.centerY, layout.textZ]}
        planeW={layout.textPlaneW}
        planeH={layout.textPlaneH}
        fontSize={fontSize}
      />
      <NeonInscriptionPanel
        lines={GIFT_WALL_INSCRIPTION.right}
        position={[layout.rightX, layout.centerY, layout.textZ]}
        planeW={layout.textPlaneW}
        planeH={layout.textPlaneH}
        fontSize={fontSize}
      />

    </group>
  )
}
