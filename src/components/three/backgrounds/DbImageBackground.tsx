'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity } from '@/components/three/backgrounds/live-utils'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'
import {
  BACKGROUND_FOG,
  BACKGROUND_GLOW,
  type BackgroundRouteKey,
  type PageBackgroundProps,
} from '@/lib/site-background-routes'

/** Real project screenshots living in the Supabase `showcase` storage bucket. */
const PROJECT_SLUGS = ['bodulica', 'zeustrading', 'cosmic-blueprint', 'protosweb'] as const

/** Per-route seed so every page gets a distinct scatter of the same images. */
const ROUTE_SEED: Record<BackgroundRouteKey, number> = {
  home: 101,
  about: 211,
  process: 307,
  portfolio: 401,
  services: 509,
  blog: 601,
  contact: 719,
}

/** Shared texture cache — the same screenshot is loaded once and reused everywhere. */
const textureCache = new Map<string, THREE.Texture>()
const failedTextures = new Set<string>()

function useShowcaseTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => textureCache.get(url) ?? null)

  useEffect(() => {
    const cached = textureCache.get(url)
    if (cached) {
      setTexture(cached)
      return
    }
    if (failedTextures.has(url)) return

    let cancelled = false
    const loader = new THREE.TextureLoader()
    if (url.startsWith('http://') || url.startsWith('https://')) {
      loader.setCrossOrigin('anonymous')
    }
    loader.load(
      url,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.minFilter = THREE.LinearFilter
        loaded.magFilter = THREE.LinearFilter
        loaded.needsUpdate = true
        textureCache.set(url, loaded)
        if (!cancelled) setTexture(loaded)
      },
      undefined,
      () => {
        failedTextures.add(url)
      },
    )

    return () => {
      cancelled = true
    }
  }, [url])

  return texture
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type PanelConfig = {
  url: string
  w: number
  h: number
  x: number
  y: number
  z: number
  phase: number
  drift: number
  tilt: number
}

function buildPanels(routeKey: BackgroundRouteKey, isMobile: boolean): PanelConfig[] {
  const rand = mulberry32(ROUTE_SEED[routeKey])
  const count = isMobile ? 5 : 8
  const spreadX = isMobile ? 5 : 8.5
  const panels: PanelConfig[] = []

  for (let i = 0; i < count; i++) {
    const view: 'desktop' | 'mobile' = rand() > 0.4 ? 'desktop' : 'mobile'
    const slug = PROJECT_SLUGS[Math.floor(rand() * PROJECT_SLUGS.length)]
    const url = getShowcaseStorageUrl(SHOWCASE_STORAGE.project(slug, view))
    const w = view === 'desktop' ? 2.6 + rand() * 1.7 : 1.2 + rand() * 0.6
    const aspect = view === 'desktop' ? 1.6 : 0.46
    const h = w / aspect

    panels.push({
      url,
      w,
      h,
      x: (rand() * 2 - 1) * spreadX,
      y: (rand() * 2 - 1) * 3.4,
      z: -5 - rand() * 8,
      phase: rand() * Math.PI * 2,
      drift: 0.4 + rand() * 0.5,
      tilt: (rand() * 2 - 1) * 0.18,
    })
  }

  return panels
}

function ScreenshotPanel({ cfg, accent }: { cfg: PanelConfig; accent: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const texture = useShowcaseTexture(cfg.url)
  const frameW = 0.045

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return
    const t = state.clock.elapsedTime * cfg.drift + cfg.phase
    g.position.x = cfg.x + Math.sin(t * 0.5) * 0.5
    g.position.y = cfg.y + Math.cos(t * 0.4) * 0.35
    g.rotation.z = cfg.tilt + Math.sin(t * 0.3) * 0.05
    g.rotation.y = Math.sin(t * 0.25) * 0.15
    if (matRef.current) {
      matRef.current.opacity = pulseOpacity(t * 0.6, cfg.phase, texture ? 0.34 : 0.16, texture ? 0.5 : 0.24)
    }
  })

  return (
    <group ref={groupRef} position={[cfg.x, cfg.y, cfg.z]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[cfg.w + 0.28, cfg.h + 0.28]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <mesh>
        <planeGeometry args={[cfg.w, cfg.h]} />
        {texture ? (
          <meshBasicMaterial
            ref={matRef}
            map={texture}
            transparent
            opacity={0.44}
            depthWrite={false}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial ref={matRef} color={accent} transparent opacity={0.2} depthWrite={false} />
        )}
      </mesh>

      {(
        [
          [0, cfg.h / 2, cfg.w + frameW, frameW],
          [0, -cfg.h / 2, cfg.w + frameW, frameW],
          [-cfg.w / 2, 0, frameW, cfg.h],
          [cfg.w / 2, 0, frameW, cfg.h],
        ] as const
      ).map(([px, py, fw, fh], i) => (
        <mesh key={i} position={[px, py, 0.01]}>
          <planeGeometry args={[fw, fh]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function DbImageBackground({ isMobile = false, routeKey = 'home' }: PageBackgroundProps) {
  const panels = useMemo(() => buildPanels(routeKey, isMobile), [routeKey, isMobile])
  const accent = BACKGROUND_GLOW[routeKey]
  const fog = BACKGROUND_FOG[routeKey]

  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={fog} glowColor={accent}>
      {panels.map((cfg, i) => (
        <ScreenshotPanel key={`${routeKey}-${i}`} cfg={cfg} accent={accent} />
      ))}
    </AmbientBackgroundShell>
  )
}
