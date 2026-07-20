import 'server-only'
import type { PublishResult, PublisherContext, ShortPostInput } from './types'

const GRAPH = 'https://graph.threads.net/v1.0'

/**
 * Threads publisher (Meta Threads Graph API).
 *
 * Prerequisites:
 *   1. Threads Developer app (developers.facebook.com) + Threads product
 *   2. Threads user long-lived access token (60 days, refreshable)
 *   3. Threads user ID
 *
 * Vault: provider `threads` → long-lived access token
 * options.userId = numeric Threads user ID.
 *
 * Two-step publish: create container, then publish.
 */
export async function publishToThreads(
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const token = ctx.secrets.accessToken?.trim()
  const userId = ctx.options?.userId?.trim()

  if (!token) throw new Error('Threads: fali access token u API keys vault-u')
  if (!userId) throw new Error('Threads: fali options.userId (Threads user ID)')

  const containerParams = new URLSearchParams()
  containerParams.set('media_type', input.imageUrl ? 'IMAGE' : 'TEXT')
  containerParams.set('text', input.linkUrl ? `${input.text}\n\n${input.linkUrl}` : input.text)
  if (input.imageUrl) containerParams.set('image_url', input.imageUrl)
  containerParams.set('access_token', token)

  const containerRes = await fetch(`${GRAPH}/${userId}/threads`, {
    method: 'POST',
    body: containerParams,
  })
  if (!containerRes.ok) {
    throw new Error(
      `Threads container failed (${containerRes.status}): ${await containerRes.text()}`,
    )
  }
  const container = (await containerRes.json()) as { id: string }

  const publishParams = new URLSearchParams()
  publishParams.set('creation_id', container.id)
  publishParams.set('access_token', token)

  const publishRes = await fetch(`${GRAPH}/${userId}/threads_publish`, {
    method: 'POST',
    body: publishParams,
  })
  if (!publishRes.ok) {
    throw new Error(
      `Threads publish failed (${publishRes.status}): ${await publishRes.text()}`,
    )
  }
  const published = (await publishRes.json()) as { id: string }

  return {
    remoteId: published.id,
    remoteUrl: `https://www.threads.net/@${userId}/post/${published.id}`,
    response: { container, published } as unknown as Record<string, unknown>,
  }
}
