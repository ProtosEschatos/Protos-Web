import 'server-only'
import { createHmac } from 'crypto'
import type { ArticleInput, PublishResult, PublisherContext } from './types'

/**
 * Ghost Admin API publisher.
 *
 * Vault: provider `ghost` → Admin API key formatted as `{id}:{secret}`.
 * options.adminUrl = e.g. https://mysite.ghost.io.
 *
 * Admin API uses a short-lived JWT signed with the secret (HS256, 5 min TTL).
 */
export async function publishToGhost(
  input: ArticleInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const combined = ctx.secrets.adminApiKey?.trim()
  const adminUrl = (ctx.options?.adminUrl ?? '').replace(/\/$/, '')

  if (!combined || !combined.includes(':')) {
    throw new Error('Ghost: fali Admin API key formata "id:secret" u vault-u')
  }
  if (!adminUrl || !/^https:\/\//i.test(adminUrl)) {
    throw new Error('Ghost: fali options.adminUrl (npr. https://mysite.ghost.io)')
  }

  const [id, secretHex] = combined.split(':')
  const secret = Buffer.from(secretHex, 'hex')

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id }))
  const payload = base64url(
    JSON.stringify({ iat: now, exp: now + 5 * 60, aud: '/admin/' }),
  )
  const signature = base64url(
    createHmac('sha256', secret).update(`${header}.${payload}`).digest(),
  )
  const jwt = `${header}.${payload}.${signature}`

  const body = {
    posts: [
      {
        title: input.title,
        html: markdownToBasicHtml(input.markdown),
        custom_excerpt: input.excerpt?.slice(0, 300),
        canonical_url: input.canonicalUrl,
        tags: (input.tags ?? []).slice(0, 5).map((name) => ({ name })),
        feature_image: input.coverImageUrl,
        status: input.published === false ? 'draft' : 'published',
      },
    ],
  }

  const res = await fetch(`${adminUrl}/ghost/api/admin/posts/?source=html`, {
    method: 'POST',
    headers: {
      authorization: `Ghost ${jwt}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Ghost publish failed (${res.status}): ${await res.text()}`)
  }
  const created = (await res.json()) as {
    posts: Array<{ id: string; url: string }>
  }
  const post = created.posts?.[0]
  if (!post) throw new Error('Ghost: response missing posts[0]')
  return {
    remoteId: post.id,
    remoteUrl: post.url,
    response: created as unknown as Record<string, unknown>,
  }
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Minimal Markdown → HTML shim. Enough for Ghost's `?source=html` importer
 * (which itself understands most inline HTML). We deliberately avoid pulling
 * a full markdown library here — Ghost editor will normalise the rest.
 */
function markdownToBasicHtml(md: string): string {
  return md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .split(/\n{2,}/)
    .map((para) =>
      /^<h[1-6]|^<ul|^<ol|^<pre|^<blockquote/.test(para.trim()) ? para : `<p>${para}</p>`,
    )
    .join('\n')
}
