import 'server-only'
import type { ArticleInput, PublishResult, PublisherContext } from './types'

/**
 * Dev.to (Forem) publisher.
 *
 * Vault: provider `devto` → API key from https://dev.to/settings/extensions.
 * No options required.
 *
 * dev.to accepts Markdown with front-matter-less body_markdown.
 */
export async function publishToDevTo(
  input: ArticleInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const key = ctx.secrets.apiKey?.trim()
  if (!key) throw new Error('Dev.to: fali API key u vault-u')

  const article: Record<string, unknown> = {
    title: input.title,
    body_markdown: input.markdown,
    published: input.published !== false,
    description: input.excerpt?.slice(0, 210),
    canonical_url: input.canonicalUrl,
    tags: (input.tags ?? []).slice(0, 4).map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')),
    main_image: input.coverImageUrl,
  }

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': key,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ article }),
  })
  if (!res.ok) {
    throw new Error(`Dev.to publish failed (${res.status}): ${await res.text()}`)
  }
  const created = (await res.json()) as { id: number; url: string; slug: string }
  return {
    remoteId: String(created.id),
    remoteUrl: created.url,
    response: created as unknown as Record<string, unknown>,
  }
}
