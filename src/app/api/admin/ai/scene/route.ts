import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-auth'
import { generateSceneCommands } from '@/lib/ai/scene-tools'
import {
  scenePromptRequest,
  type SceneCommand,
} from '@/lib/schemas/scene-command'
import { getPolyPizzaModel, searchPolyPizza } from '@/lib/config/poly-pizza'
import {
  requestSketchfabDownloadUrl,
  searchSketchfabModels,
} from '@/lib/config/sketchfab'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Simple in-memory rate limiter — 30 requests per 60s per admin. */
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string): { allowed: boolean; retryIn?: number } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true }
  }
  if (bucket.count >= RATE_LIMIT) {
    return { allowed: false, retryIn: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count += 1
  return { allowed: true }
}

type ResolvedCommand =
  | SceneCommand
  | {
      type: 'import_model_resolved'
      source: 'sketchfab' | 'poly-pizza' | 'url'
      url: string
      name: string
    }

async function resolveImport(
  command: Extract<SceneCommand, { type: 'import_model' }>,
): Promise<ResolvedCommand | { type: 'import_model_error'; error: string }> {
  const { source, query } = command

  if (source === 'url') {
    if (!/^https?:\/\/.+\.(glb|gltf)(\?.*)?$/i.test(query)) {
      return { type: 'import_model_error', error: 'URL mora završavati .glb ili .gltf' }
    }
    return { type: 'import_model_resolved', source: 'url', url: query, name: query.split('/').pop() ?? query }
  }

  if (source === 'poly-pizza') {
    // If AI passed a direct download URL, respect it.
    if (/^https?:\/\/.+\.(glb|gltf)(\?.*)?$/i.test(query)) {
      const { url, error } = await getPolyPizzaModel(query)
      if (!url) return { type: 'import_model_error', error: error ?? 'Model nije pronađen' }
      return { type: 'import_model_resolved', source, url, name: query.split('/').pop() ?? query }
    }
    const result = await searchPolyPizza(query, { limit: 1 })
    const first = result.models[0]
    if (!first?.downloadUrl) {
      return { type: 'import_model_error', error: result.error ?? `Nema Poly.Pizza rezultata za "${query}"` }
    }
    return { type: 'import_model_resolved', source, url: first.downloadUrl, name: first.name }
  }

  // sketchfab
  const search = await searchSketchfabModels(query, { limit: 5 })
  if (!search.configured) {
    return { type: 'import_model_error', error: 'Sketchfab token nije postavljen. Otvori API ključevi > sketchfab.' }
  }
  const downloadable = search.models.find((m) => m.isDownloadable) ?? search.models[0]
  if (!downloadable) {
    return { type: 'import_model_error', error: `Nema Sketchfab rezultata za "${query}"` }
  }
  const { url, error } = await requestSketchfabDownloadUrl(downloadable.uid)
  if (!url) return { type: 'import_model_error', error: error ?? 'Model nije preuzimljiv' }
  return { type: 'import_model_resolved', source, url, name: downloadable.name }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const headerStore = await headers()
  const rateKey = token ?? headerStore.get('x-forwarded-for') ?? 'anon'
  const { allowed, retryIn } = rateLimit(`ai-scene:${rateKey}`)
  if (!allowed) {
    return NextResponse.json(
      { error: `Previše upita. Pokušaj za ${retryIn ?? 60}s.` },
      { status: 429, headers: { 'Retry-After': String(retryIn ?? 60) } },
    )
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = scenePromptRequest.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Neispravan zahtjev' },
      { status: 400 },
    )
  }

  const result = await generateSceneCommands(parsed.data.prompt, parsed.data.currentState)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  const resolvedCommands: ResolvedCommand[] = []
  const importErrors: string[] = []
  for (const cmd of result.batch.commands) {
    if (cmd.type === 'import_model') {
      const resolved = await resolveImport(cmd)
      if (resolved.type === 'import_model_error') {
        importErrors.push(resolved.error)
        continue
      }
      resolvedCommands.push(resolved)
    } else {
      resolvedCommands.push(cmd)
    }
  }

  return NextResponse.json({
    commands: resolvedCommands,
    narration: result.batch.narration ?? null,
    provider: result.provider,
    importErrors: importErrors.length > 0 ? importErrors : undefined,
  })
}
