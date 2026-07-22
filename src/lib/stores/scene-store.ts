'use client'

import { create } from 'zustand'

export type ScenePrimitive = 'box' | 'sphere' | 'torus' | 'sketchfab' | 'poly-pizza' | 'gltf-url'

export type SceneEnvironment =
  | 'studio'
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'city'
  | 'park'
  | 'lobby'

export interface SceneState {
  primitive: ScenePrimitive
  gltfUrl: string | null
  color: string
  metalness: number
  roughness: number
  emissive: string
  emissiveIntensity: number
  environment: SceneEnvironment
  environmentIntensity: number
  ambientIntensity: number
  directionalIntensity: number
  autoRotate: boolean
  background: string
  wireframe: boolean

  setPartial: (patch: Partial<SceneState>) => void
  reset: () => void
  loadGltf: (url: string) => void
}

const DEFAULTS: Omit<SceneState, 'setPartial' | 'reset' | 'loadGltf'> = {
  primitive: 'sphere',
  gltfUrl: null,
  color: '#818cf8',
  metalness: 0.6,
  roughness: 0.25,
  emissive: '#000000',
  emissiveIntensity: 0.0,
  environment: 'studio',
  environmentIntensity: 1.0,
  ambientIntensity: 0.4,
  directionalIntensity: 1.2,
  autoRotate: true,
  background: '#020617',
  wireframe: false,
}

/**
 * Browser CSP blocks direct fetches to Sketchfab / Poly.Pizza CDNs.
 * Same-origin admin proxy keeps `useGLTF` working online.
 * Supabase signed URLs already allowed via `connect-src *.supabase.co`.
 */
export function rewriteGltfUrlForBrowser(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('/')) return trimmed
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return trimmed
    if (parsed.hostname.endsWith('.supabase.co')) return trimmed
    if (parsed.pathname.startsWith('/api/admin/gltf-proxy')) return trimmed
    return `/api/admin/gltf-proxy?url=${encodeURIComponent(parsed.toString())}`
  } catch {
    return trimmed
  }
}

export const useSceneStore = create<SceneState>((set) => ({
  ...DEFAULTS,
  setPartial: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set(() => ({ ...DEFAULTS })),
  loadGltf: (url) =>
    set(() => ({ primitive: 'gltf-url', gltfUrl: rewriteGltfUrlForBrowser(url) })),
}))
