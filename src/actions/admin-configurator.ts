'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import {
  requestSketchfabDownloadUrl,
  searchSketchfabModels,
  type SketchfabModel,
} from '@/lib/config/sketchfab'
import {
  getPolyPizzaModel,
  searchPolyPizza,
  type PolyPizzaModel,
} from '@/lib/config/poly-pizza'

type Result<T> = { success: true; data: T } | { success: false; error: string }

export async function adminSearchSketchfab(
  query: string,
  opts?: { downloadableOnly?: boolean },
): Promise<Result<{ models: SketchfabModel[]; configured: boolean }>> {
  await requireAdmin()
  const q = query.trim()
  if (q.length < 2) return { success: false, error: 'Upit mora imati barem 2 znaka' }

  try {
    const result = await searchSketchfabModels(q, opts)
    if (result.error && !result.configured) {
      return { success: false, error: result.error }
    }
    return {
      success: true,
      data: { models: result.models, configured: result.configured },
    }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function adminGetSketchfabDownload(uid: string): Promise<Result<{ url: string }>> {
  await requireAdmin()
  if (!uid.trim()) return { success: false, error: 'Nedostaje model uid' }
  try {
    const { url, error } = await requestSketchfabDownloadUrl(uid)
    if (!url) return { success: false, error: error ?? 'Model nije preuzimljiv' }
    return { success: true, data: { url } }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function adminSearchPolyPizza(
  query: string,
): Promise<Result<{ models: PolyPizzaModel[]; configured: boolean }>> {
  await requireAdmin()
  const q = query.trim()
  if (q.length < 2) return { success: false, error: 'Upit mora imati barem 2 znaka' }

  try {
    const result = await searchPolyPizza(q)
    if (result.error && result.models.length === 0) {
      return { success: false, error: result.error }
    }
    return {
      success: true,
      data: { models: result.models, configured: result.configured },
    }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function adminGetPolyPizzaModel(
  idOrUrl: string,
): Promise<Result<{ url: string }>> {
  await requireAdmin()
  if (!idOrUrl.trim()) return { success: false, error: 'Nedostaje id ili URL' }
  try {
    const { url, error } = await getPolyPizzaModel(idOrUrl)
    if (!url) return { success: false, error: error ?? 'Model nije pronađen' }
    return { success: true, data: { url } }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}
