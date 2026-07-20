import 'server-only'
import { getActiveApiKey } from '@/lib/queries/admin/api-keys'

export type SketchfabModel = {
  uid: string
  name: string
  viewerUrl: string
  thumbnailUrl: string | null
  author: string | null
  vertexCount: number | null
  isDownloadable: boolean
  license: string | null
  gltfDownloadUrl?: string | null
}

type SketchfabRawModel = {
  uid: string
  name: string
  viewerUrl: string
  thumbnails?: { images?: { url: string; width: number }[] } | null
  user?: { username?: string; displayName?: string } | null
  vertexCount?: number | null
  isDownloadable?: boolean
  license?: { label?: string } | null
}

type SketchfabSearchResponse = {
  results?: SketchfabRawModel[]
  next?: string | null
}

const SEARCH_URL = 'https://api.sketchfab.com/v3/search'

function pickThumbnail(model: SketchfabRawModel): string | null {
  const images = model.thumbnails?.images ?? []
  if (images.length === 0) return null
  const sorted = [...images].sort((a, b) => a.width - b.width)
  const target = sorted.find((img) => img.width >= 448) ?? sorted[sorted.length - 1]
  return target?.url ?? null
}

async function resolveToken(): Promise<string | null> {
  const fromVault = await getActiveApiKey('sketchfab').catch(() => null)
  if (fromVault) return fromVault
  return process.env.SKETCHFAB_API_TOKEN?.trim() || null
}

export type SketchfabSearchResult = {
  configured: boolean
  models: SketchfabModel[]
  error?: string
}

export async function searchSketchfabModels(query: string, opts?: { downloadableOnly?: boolean; limit?: number }): Promise<SketchfabSearchResult> {
  const token = await resolveToken()
  if (!token) {
    return { configured: false, models: [], error: 'Sketchfab API token nije postavljen (vault ili env).' }
  }

  const params = new URLSearchParams({
    type: 'models',
    q: query,
    count: String(Math.min(opts?.limit ?? 24, 24)),
    sort_by: '-likeCount',
  })
  if (opts?.downloadableOnly !== false) {
    params.set('downloadable', 'true')
  }

  const response = await fetch(`${SEARCH_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return {
      configured: true,
      models: [],
      error: `Sketchfab ${response.status}: ${await response.text().catch(() => '')}`.slice(0, 300),
    }
  }

  const payload = (await response.json()) as SketchfabSearchResponse
  const models = (payload.results ?? []).map((raw) => ({
    uid: raw.uid,
    name: raw.name,
    viewerUrl: raw.viewerUrl,
    thumbnailUrl: pickThumbnail(raw),
    author: raw.user?.displayName ?? raw.user?.username ?? null,
    vertexCount: raw.vertexCount ?? null,
    isDownloadable: Boolean(raw.isDownloadable),
    license: raw.license?.label ?? null,
  }))

  return { configured: true, models }
}

/**
 * Request a signed download URL for a Sketchfab model. Requires that the token
 * has model download rights and that the model is downloadable.
 */
export async function requestSketchfabDownloadUrl(uid: string): Promise<{ url: string | null; error?: string }> {
  const token = await resolveToken()
  if (!token) return { url: null, error: 'Sketchfab token nedostaje' }

  const response = await fetch(`https://api.sketchfab.com/v3/models/${encodeURIComponent(uid)}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    return { url: null, error: `Sketchfab download ${response.status}` }
  }
  const payload = (await response.json()) as { gltf?: { url?: string }; glb?: { url?: string } }
  return { url: payload.gltf?.url ?? payload.glb?.url ?? null }
}
