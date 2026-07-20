import 'server-only'
import type { PublishResult, PublisherContext, ShortPostInput } from './types'

const GRAPH = 'https://graph.facebook.com/v20.0'

/**
 * Facebook Page publisher (Meta Graph API).
 *
 * Vault: provider `facebook` → Page access token (NOT user token).
 * options.pageId = numeric Page ID.
 *
 * Free-form text posts or link posts. For images use /photos endpoint.
 */
export async function publishToFacebookPage(
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const token = ctx.secrets.accessToken?.trim()
  const pageId = ctx.options?.pageId?.trim()

  if (!token) throw new Error('Facebook: fali Page access token u vault-u')
  if (!pageId) throw new Error('Facebook: fali options.pageId')

  const params = new URLSearchParams()
  params.set('message', input.text)
  if (input.linkUrl) params.set('link', input.linkUrl)
  params.set('access_token', token)

  const endpoint = input.imageUrl
    ? `${GRAPH}/${pageId}/photos`
    : `${GRAPH}/${pageId}/feed`
  if (input.imageUrl) params.set('url', input.imageUrl)

  const res = await fetch(endpoint, {
    method: 'POST',
    body: params,
  })
  if (!res.ok) {
    throw new Error(`Facebook publish failed (${res.status}): ${await res.text()}`)
  }
  const created = (await res.json()) as { id: string; post_id?: string }
  const id = created.post_id ?? created.id
  return {
    remoteId: id,
    remoteUrl: `https://www.facebook.com/${id}`,
    response: created as unknown as Record<string, unknown>,
  }
}

/**
 * Instagram Business publisher (Meta Graph API).
 *
 * Requires:
 *   - IG Business account linked to a Facebook Page
 *   - Vault: provider `instagram` → Page access token
 *   - options.igUserId = IG Business user ID
 *
 * REQUIRES image_url — IG API does not accept text-only posts.
 * Two-step: media container → publish.
 */
export async function publishToInstagram(
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const token = ctx.secrets.accessToken?.trim()
  const igUserId = ctx.options?.igUserId?.trim()

  if (!token) throw new Error('Instagram: fali access token u vault-u')
  if (!igUserId) throw new Error('Instagram: fali options.igUserId')
  if (!input.imageUrl) throw new Error('Instagram: imageUrl je obavezan (IG API ne prima text-only)')

  const caption = input.linkUrl
    ? `${input.text}\n\n${input.linkUrl}`
    : input.text

  const createParams = new URLSearchParams()
  createParams.set('image_url', input.imageUrl)
  createParams.set('caption', caption)
  createParams.set('access_token', token)

  const createRes = await fetch(`${GRAPH}/${igUserId}/media`, {
    method: 'POST',
    body: createParams,
  })
  if (!createRes.ok) {
    throw new Error(`IG container failed (${createRes.status}): ${await createRes.text()}`)
  }
  const container = (await createRes.json()) as { id: string }

  const publishParams = new URLSearchParams()
  publishParams.set('creation_id', container.id)
  publishParams.set('access_token', token)

  const pubRes = await fetch(`${GRAPH}/${igUserId}/media_publish`, {
    method: 'POST',
    body: publishParams,
  })
  if (!pubRes.ok) {
    throw new Error(`IG publish failed (${pubRes.status}): ${await pubRes.text()}`)
  }
  const published = (await pubRes.json()) as { id: string }

  return {
    remoteId: published.id,
    remoteUrl: `https://www.instagram.com/p/${published.id}`,
    response: { container, published } as unknown as Record<string, unknown>,
  }
}
