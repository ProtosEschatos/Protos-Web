'use client'

import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { GIFT_PORTAL_INSCRIPTION } from '@/lib/showcase/featured-demo'

const POKLON_COLOR = 0xff6600
const POKLON_ACCENT = 0x06b6d4

function WindowFrameBar({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number, number]
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={0x94a3b8} metalness={0.55} roughness={0.35} />
    </mesh>
  )
}

type GiftPortalProps = {
  viewport: ShowcaseViewport
  onProximityChange: (near: boolean) => void
  characterRef: React.RefObject<THREE.Group | null>
}

export function GiftPortal({ viewport, onProximityChange, characterRef }: GiftPortalProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lastNear = useRef(false)
  const { viewW, viewH, frameW, depth, centerY } = getFrameDimensions(viewport)
  const outerW = viewW + frameW * 2
  const outerH = viewH + frameW * 2
  const z = -SHOWCASE_CONFIG.galleryLength / 2 + 0.35
  const compact = viewport === 'mobile'

  useFrame((state) => {
    const character = characterRef.current
    if (!character) return

    if (groupRef.current) {
      groupRef.current.position.y = centerY + Math.sin(state.clock.elapsedTime * 1.2) * 0.015
    }

    const portalPos = new THREE.Vector3(0, centerY * 0.35, z)
    const near = character.position.distanceTo(portalPos) < 4.5
    if (near !== lastNear.current) {
      lastNear.current = near
      onProximityChange(near)
    }
  })

  return (
    <group ref={groupRef} position={[0, centerY, z]} rotation={[0, 0, 0]} renderOrder={20}>
      <mesh position={[0, 0, -depth * 0.5]} renderOrder={20}>
        <boxGeometry args={[outerW + 0.08, outerH + 0.08, depth]} />
        <meshStandardMaterial
          color={0x1e1b4b}
          metalness={0.65}
          roughness={0.32}
          emissive={POKLON_COLOR}
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 0, 0.001]} renderOrder={21}>
        <planeGeometry args={[viewW, viewH]} />
        <meshStandardMaterial color={0x020617} emissive={POKLON_COLOR} emissiveIntensity={0.12} roughness={0.35} />
      </mesh>

      <WindowFrameBar position={[0, outerH / 2 - frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
      <WindowFrameBar position={[0, -outerH / 2 + frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
      <WindowFrameBar position={[-outerW / 2 + frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />
      <WindowFrameBar position={[outerW / 2 - frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />

      <mesh position={[0, -outerH / 2 - 0.04, depth * 0.12]} renderOrder={22}>
        <boxGeometry args={[outerW + 0.12, 0.06, depth * 0.45]} />
        <meshStandardMaterial color={0x64748b} metalness={0.5} roughness={0.45} />
      </mesh>

      <mesh position={[0, 0, 0.018]} renderOrder={23}>
        <planeGeometry args={[viewW * 0.94, viewH * 0.94]} />
        <meshBasicMaterial color={0xffdcc2} transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, outerH / 2 - frameW / 2 + 0.01, depth * 0.22]} renderOrder={24}>
        <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
        <meshBasicMaterial color={POKLON_COLOR} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, -outerH / 2 + frameW / 2 - 0.01, depth * 0.22]} renderOrder={24}>
        <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
        <meshBasicMaterial color={POKLON_ACCENT} transparent opacity={0.95} />
      </mesh>

      <Html
        transform
        occlude
        distanceFactor={compact ? 2.8 : 2.15}
        position={[0, 0, 0.03]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ width: compact ? 200 : 280 }}
        >
          <p
            className={`${compact ? 'text-[1.25rem]' : 'text-[1.75rem]'} font-light uppercase tracking-[0.32em] text-[#ff6600]`}
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 0 24px rgba(255,102,0,0.35)' }}
          >
            {GIFT_PORTAL_INSCRIPTION.line1}
          </p>
          <p
            className={`${compact ? 'mt-2 text-[1.05rem]' : 'mt-3 text-[1.4rem]'} font-light uppercase tracking-[0.26em] text-[#06b6d4]`}
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 0 20px rgba(6,182,212,0.3)' }}
          >
            {GIFT_PORTAL_INSCRIPTION.line2}
          </p>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#ff6600] to-transparent opacity-80" />
        </div>
      </Html>

      <pointLight position={[0, 0.3, 0.5]} color={POKLON_COLOR} intensity={1.8} distance={8} decay={2} />
      <pointLight position={[0, -0.2, 0.4]} color={POKLON_ACCENT} intensity={0.9} distance={6} decay={2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -outerH / 2 - 0.5, 0.8]}>
        <ringGeometry args={[1, 1.5, 32]} />
        <meshBasicMaterial color={POKLON_COLOR} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function getGiftPortalPosition(centerY: number): THREE.Vector3 {
  return new THREE.Vector3(0, centerY * 0.35, -SHOWCASE_CONFIG.galleryLength / 2 + 0.35)
}
