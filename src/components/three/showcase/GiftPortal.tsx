'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { FrameScreenshot } from './FrameScreenshot'

const POKLON_COLOR = 0xff6600

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
        <boxGeometry args={[outerW + 0.2, outerH + 0.2, depth]} />
        <meshStandardMaterial color={0x1e1b4b} metalness={0.7} roughness={0.3} emissive={0xff6600} emissiveIntensity={0.08} />
      </mesh>

      <mesh position={[0, 0, 0.001]} renderOrder={21}>
        <planeGeometry args={[viewW, viewH]} />
        <meshStandardMaterial color={0x0f172a} emissive={POKLON_COLOR} emissiveIntensity={0.15} roughness={0.35} />
      </mesh>

      <FrameScreenshot imageUrl={null} width={viewW * 0.94} height={viewH * 0.94} z={0.012} fallbackColor={POKLON_COLOR} />

      <mesh position={[0, outerH / 2 - frameW / 2 + 0.01, depth * 0.22]} renderOrder={22}>
        <boxGeometry args={[outerW - 0.02, 0.022, 0.028]} />
        <meshBasicMaterial color={POKLON_COLOR} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, -outerH / 2 + frameW / 2 - 0.01, depth * 0.22]} renderOrder={22}>
        <boxGeometry args={[outerW - 0.02, 0.022, 0.028]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.95} />
      </mesh>

      <pointLight position={[0, 0.3, 0.5]} color={POKLON_COLOR} intensity={1.8} distance={8} decay={2} />
      <pointLight position={[0, -0.2, 0.4]} color={0x06b6d4} intensity={0.9} distance={6} decay={2} />

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
