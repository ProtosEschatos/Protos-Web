import 'server-only'
import { publishToBluesky } from './bluesky'
import { publishToDevTo } from './devto'
import { publishToFacebookPage, publishToInstagram } from './meta'
import { publishToGhost } from './ghost'
import { publishToHashnode } from './hashnode'
import { publishToMastodon } from './mastodon'
import { publishToThreads } from './threads'
import type {
  ArticleInput,
  PublishPlatform,
  PublishResult,
  PublisherContext,
  ShortPostInput,
} from './types'

export * from './types'
export { PUBLISHERS } from './meta-catalog'
export type { PublisherMeta } from './meta-catalog'

export async function runShortPublisher(
  platform: Extract<PublishPlatform, 'bluesky' | 'mastodon' | 'threads' | 'facebook' | 'instagram'>,
  input: ShortPostInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  switch (platform) {
    case 'bluesky':
      return publishToBluesky(input, ctx)
    case 'mastodon':
      return publishToMastodon(input, ctx)
    case 'threads':
      return publishToThreads(input, ctx)
    case 'facebook':
      return publishToFacebookPage(input, ctx)
    case 'instagram':
      return publishToInstagram(input, ctx)
  }
}

export async function runArticlePublisher(
  platform: Extract<PublishPlatform, 'ghost' | 'hashnode' | 'devto'>,
  input: ArticleInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  switch (platform) {
    case 'ghost':
      return publishToGhost(input, ctx)
    case 'hashnode':
      return publishToHashnode(input, ctx)
    case 'devto':
      return publishToDevTo(input, ctx)
  }
}
