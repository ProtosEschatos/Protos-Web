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

export const useSceneStore = create<SceneState>((set) => ({
  ...DEFAULTS,
  setPartial: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set(() => ({ ...DEFAULTS })),
  loadGltf: (url) =>
    set(() => ({ primitive: 'gltf-url', gltfUrl: url })),
}))
