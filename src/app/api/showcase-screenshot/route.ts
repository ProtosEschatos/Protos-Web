import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set([
  'bodulica.shop',
  'www.bodulica.shop',
  'zeustrading.online',
  'www.zeustrading.online',
  'cosmic-blueprint.net',
  'www.cosmic-blueprint.net',
  'protosweb.eu',
  'www.protosweb.eu',
])

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url')
  if (!raw) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  const viewport = request.nextUrl.searchParams.get('viewport') ?? 'mobile'
  const shotUrl =
    viewport === 'desktop'
      ? `https://image.thum.io/get/width/800/crop/600/noanimate/${parsed.href}`
      : `https://image.thum.io/get/width/390/crop/844/noanimate/${parsed.href}`

  try {
    const upstream = await fetch(shotUrl, {
      headers: { 'User-Agent': 'ProtosWeb-Showcase/1.0' },
      next: { revalidate: 86400 },
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Screenshot unavailable' }, { status: 502 })
    }

    const body = await upstream.arrayBuffer()
    return new NextResponse(body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Screenshot fetch failed' }, { status: 502 })
  }
}
