import 'server-only'
import type { PublishResult, PublisherContext, ShortPostInput } from './types'

/**
 * Mastodon publisher.
 *
 * Needs vault entry: provider `mastodon` → user access token
 * (create at Settings → Development → New application, scope `write:statuses`).
 *
 * options.instance must be a full origin, e.g. https://mastodon.social.
 */
export async function publishToMastodon(
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const token = ctx.secrets.accessToken?.trim()
  const instance = (ctx.options?.instance ?? '').replace(/\/$/, '')

  if (!token) throw new Error('Mastodon: fali access token u API keys vault-u')
  if (!instance || !/^https:\/\//i.test(instance)) {
    throw new Error('Mastodon: fali options.instance (npr. https://mastodon.social)')
  }

  const body = new URLSearchParams()
  const text = input.linkUrl ? `${input.text}\n\n${input.linkUrl}` : input.text
  body.set('status', text)
  body.set('language', 'hr')
  body.set('visibility', 'public')

  const res = await fetch(`${instance}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  if (!res.ok) {
    throw new Error(`Mastodon status failed (${res.status}): ${await res.text()}`)
  }
  const created = (await res.json()) as { id: string; url: string }
  return {
    remoteId: created.id,
    remoteUrl: created.url,
    response: created as unknown as Record<string, unknown>,
  }
}
