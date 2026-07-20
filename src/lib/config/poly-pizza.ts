import 'server-only'
import { getActiveApiKey } from '@/lib/queries/admin/api-keys'

/**
 * Poly.Pizza — free 3D asset registry (CC-BY). Public search endpoint works
 * without a key at ~30 requests/min. With an API key, higher limits apply.
 *
 * Docs (unofficial, community-maintained): https://poly.pizza/api
 * The public endpoint returns JSON with model metadata + a `Download` URL
 * pointing to a .glb we can load directly into R3F.
 */

export type PolyPizzaModel = {
  id: string
  name: string
  viewerUrl: string
  thumbnailUrl: string | null
  author: string | null
  license: string
  downloadUrl: string | null
  tris: number | null
}

type PolyPizzaRawModel = {
  ID?: string
  id?: string
  Title?: string
  title?: string
  name?: string
  Attribution?: string
  Creator?: { Username?: string; Name?: string } | null
  Thumbnail?: string
  thumbnail?: string
  Download?: string
  download?: string
  Tris?: number
  tris?: number
  Licence?: string
  License?: string
}

type PolyPizzaSearchResponse = {
  results?: PolyPizzaRawModel[]
  total?: number
}

const SEARCH_URL = 'https://api.poly.pizza/v1.1/search'

async function resolveToken(): Promise<string | null> {
  const fromVault = await getActiveApiKey('polypizza').catch(() => null)
  if (fromVault) return fromVault
  return process.env.POLY_PIZZA_API_KEY?.trim() || null
}

function normalize(raw: PolyPizzaRawModel): PolyPizzaModel {
  const id = raw.ID ?? raw.id ?? ''
  const name = raw.Title ?? raw.title ?? raw.name ?? 'Untitled'
  const author =
    raw.Creator?.Name ??
    raw.Creator?.Username ??
    (raw.Attribution ? raw.Attribution.replace(/^by\s+/i, '').trim() : null)
  return {
    id,
    name,
    viewerUrl: id ? `https://poly.pizza/m/${encodeURIComponent(id)}` : 'https://poly.pizza',
    thumbnailUrl: raw.Thumbnail ?? raw.thumbnail ?? null,
    author: author ?? null,
    license: raw.Licence ?? raw.License ?? 'CC-BY',
    downloadUrl: raw.Download ?? raw.download ?? null,
    tris: raw.Tris ?? raw.tris ?? null,
  }
}

export type PolyPizzaSearchResult = {
  models: PolyPizzaModel[]
  configured: boolean
  error?: string
}

export async function searchPolyPizza(
  query: string,
  opts?: { limit?: number },
): Promise<PolyPizzaSearchResult> {
  const q = query.trim()
  if (q.length < 2) return { models: [], configured: true, error: 'Upit prekratak' }
  const token = await resolveToken()
  const url = new URL(`${SEARCH_URL}/${encodeURIComponent(q)}`)
  url.searchParams.set('limit', String(Math.min(opts?.limit ?? 24, 24)))

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token ? { 'x-auth-token': token } : {}),
      },
      cache: 'no-store',
      // 8s timeout via AbortController
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return {
        models: [],
        configured: Boolean(token),
        error: `Poly.Pizza ${response.status}: ${(await response.text().catch(() => '')).slice(0, 200)}`,
      }
    }

    const payload = (await response.json()) as PolyPizzaSearchResponse
    const models = (payload.results ?? []).map(normalize).filter((m) => m.id && m.downloadUrl)
    return { models, configured: Boolean(token) }
  } catch (err) {
    return {
      models: [],
      configured: Boolean(token),
      error: `Poly.Pizza fetch failed: ${(err as Error).message}`.slice(0, 200),
    }
  }
}

/**
 * Poly.Pizza returns the .glb URL directly in the search payload, so this is
 * mostly a passthrough that also handles direct id-based lookups when the
 * search cache is stale (rare).
 */
export async function getPolyPizzaModel(idOrUrl: string): Promise<{ url: string | null; error?: string }> {
  const trimmed = idOrUrl.trim()
  if (!trimmed) return { url: null, error: 'Nedostaje id ili URL' }

  // If it's already a full .glb URL (from a prior search), just return it.
  if (/^https?:\/\/.+\.(glb|gltf)(\?.*)?$/i.test(trimmed)) {
    return { url: trimmed }
  }

  // Otherwise, resolve via a single-item search (poly.pizza has no /:id endpoint publicly).
  const result = await searchPolyPizza(trimmed, { limit: 1 })
  const first = result.models[0]
  if (!first?.downloadUrl) {
    return { url: null, error: result.error ?? 'Model nije pronađen' }
  }
  return { url: first.downloadUrl }
}
