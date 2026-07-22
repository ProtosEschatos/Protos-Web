/**
 * Shared admin-asset types/constants — safe to import from Client Components.
 *
 * Must NOT live in a `'use server'` file. Next.js turns non-async exports from
 * server-action modules into opaque references; importing
 * `ADMIN_ASSET_CATEGORIES` from `actions/admin-assets` into a client component
 * yields a non-array → `TypeError: p.map is not a function` on
 * `/admin/konfigurator` SSR.
 */

export const ADMIN_ASSET_CATEGORIES = [
  'image',
  'video',
  'model_glb',
  'model_gltf',
  'texture',
  'audio',
  'document',
  'other',
] as const

export type AdminAssetCategory = (typeof ADMIN_ASSET_CATEGORIES)[number]

export type AdminAsset = {
  id: string
  category: AdminAssetCategory
  bucket: string
  storagePath: string
  mimeType: string | null
  sizeBytes: number | null
  width: number | null
  height: number | null
  durationSeconds: number | null
  originalFilename: string | null
  label: string | null
  tags: string[]
  isPublished: boolean
  uploadedBy: string | null
  createdAt: string
  updatedAt: string
}
