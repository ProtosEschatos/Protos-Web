import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-auth'
import { assertPublicUrl, SsrfError } from '@/lib/security/ssrf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Cap remote GLB/GLTF fetches so a huge CDN file cannot blow the function. */
const MAX_BYTES = 40 * 1024 * 1024

/**
 * Same-origin proxy so the browser can `useGLTF` external models under CSP.
 * Admin-only. SSRF-gated via `assertPublicUrl`.
 *
 * GET /api/admin/gltf-proxy?url=https%3A%2F%2F…
 */
export async function GET(request: NextRequest) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const raw = request.nextUrl.searchParams.get('url')?.trim()
  if (!raw) {
    return NextResponse.json({ error: 'Nedostaje url' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return NextResponse.json({ error: 'Neispravan url' }, { status: 400 })
  }

  if (target.protocol !== 'https:') {
    return NextResponse.json({ error: 'Samo https URL-ovi' }, { status: 400 })
  }

  try {
    await assertPublicUrl(target.toString())
  } catch (err) {
    const message = err instanceof SsrfError ? err.message : 'URL odbijen'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(45_000),
      headers: { Accept: 'model/gltf-binary, model/gltf+json, application/octet-stream, */*' },
    })
  } catch (err) {
    return NextResponse.json(
      { error: `Upstream fetch failed: ${(err as Error).message}`.slice(0, 200) },
      { status: 502 },
    )
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream ${upstream.status}` },
      { status: 502 },
    )
  }

  const lenHeader = upstream.headers.get('content-length')
  if (lenHeader && Number(lenHeader) > MAX_BYTES) {
    return NextResponse.json({ error: 'Model prevelik (>40MB)' }, { status: 413 })
  }

  const buf = Buffer.from(await upstream.arrayBuffer())
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Model prevelik (>40MB)' }, { status: 413 })
  }

  const contentType =
    upstream.headers.get('content-type') ||
    (target.pathname.toLowerCase().endsWith('.gltf')
      ? 'model/gltf+json'
      : 'model/gltf-binary')

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(buf.byteLength),
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
