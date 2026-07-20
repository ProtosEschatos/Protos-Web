import 'server-only'
import type { PublishResult, PublisherContext, ShortPostInput } from './types'

const BSKY_HOST_DEFAULT = 'https://bsky.social'
const MAX_GRAPHEMES = 300

/**
 * Bluesky (AT Proto) publisher.
 *
 * Needs two vault entries:
 *   - provider: bluesky   → app password (create at Settings → App passwords)
 *   - identifier lives in options.identifier (e.g. "protos.bsky.social")
 *
 * Flow: com.atproto.server.createSession → get accessJwt + did,
 * then com.atproto.repo.createRecord for the post.
 */
export async function publishToBluesky(
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const identifier = ctx.options?.identifier?.trim()
  const password = ctx.secrets.appPassword?.trim()
  const host = (ctx.options?.host ?? BSKY_HOST_DEFAULT).replace(/\/$/, '')

  if (!identifier) throw new Error('Bluesky: fali identifier (npr. protos.bsky.social)')
  if (!password) throw new Error('Bluesky: fali app password u API keys vault-u')

  const text = input.text.slice(0, MAX_GRAPHEMES)

  const sessionRes = await fetch(`${host}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  })
  if (!sessionRes.ok) {
    throw new Error(`Bluesky login failed (${sessionRes.status}): ${await sessionRes.text()}`)
  }
  const session = (await sessionRes.json()) as { accessJwt: string; did: string; handle: string }

  const record: Record<string, unknown> = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
    langs: ['hr', 'en'],
  }

  if (input.linkUrl) {
    // Minimal external embed. Advanced link-card unfurl would fetch OG data,
    // but that requires an extra roundtrip — we keep it simple.
    record.embed = {
      $type: 'app.bsky.embed.external',
      external: {
        uri: input.linkUrl,
        title: input.linkUrl,
        description: '',
      },
    }
  }

  const createRes = await fetch(`${host}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  })
  if (!createRes.ok) {
    throw new Error(`Bluesky createRecord failed (${createRes.status}): ${await createRes.text()}`)
  }
  const created = (await createRes.json()) as { uri: string; cid: string }

  // AT URI: at://did/collection/rkey. Public web URL uses handle + rkey.
  const rkey = created.uri.split('/').pop() ?? ''
  const remoteUrl = `https://bsky.app/profile/${session.handle}/post/${rkey}`

  return {
    remoteId: created.uri,
    remoteUrl,
    response: created as unknown as Record<string, unknown>,
  }
}
