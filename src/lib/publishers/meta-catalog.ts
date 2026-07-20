import type { PublishKind, PublishPlatform } from './types'

/** Client-safe registry of publishers — imported by both server actions and
 *  client UI. Keep this file free of any `server-only` imports. */
export type PublisherMeta = {
  platform: PublishPlatform
  label: string
  kind: PublishKind
  /** Providers (api_key rows) that must exist active. */
  requiredProviders: string[]
  /** Extra per-request options rendered in the UI as text inputs. */
  optionFields: Array<{
    key: string
    label: string
    placeholder?: string
    required?: boolean
  }>
}

export const PUBLISHERS: Record<PublishPlatform, PublisherMeta> = {
  bluesky: {
    platform: 'bluesky',
    label: 'Bluesky',
    kind: 'short',
    requiredProviders: ['bluesky'],
    optionFields: [
      { key: 'identifier', label: 'Handle', placeholder: 'protos.bsky.social', required: true },
      { key: 'host', label: 'PDS host (opt.)', placeholder: 'https://bsky.social' },
    ],
  },
  mastodon: {
    platform: 'mastodon',
    label: 'Mastodon',
    kind: 'short',
    requiredProviders: ['mastodon'],
    optionFields: [
      { key: 'instance', label: 'Instance URL', placeholder: 'https://mastodon.social', required: true },
    ],
  },
  threads: {
    platform: 'threads',
    label: 'Threads',
    kind: 'short',
    requiredProviders: ['threads'],
    optionFields: [
      { key: 'userId', label: 'Threads user ID', required: true },
    ],
  },
  facebook: {
    platform: 'facebook',
    label: 'Facebook Page',
    kind: 'short',
    requiredProviders: ['facebook'],
    optionFields: [
      { key: 'pageId', label: 'Page ID', required: true },
    ],
  },
  instagram: {
    platform: 'instagram',
    label: 'Instagram',
    kind: 'short',
    requiredProviders: ['instagram'],
    optionFields: [
      { key: 'igUserId', label: 'IG Business user ID', required: true },
    ],
  },
  ghost: {
    platform: 'ghost',
    label: 'Ghost',
    kind: 'article',
    requiredProviders: ['ghost'],
    optionFields: [
      { key: 'adminUrl', label: 'Admin URL', placeholder: 'https://mysite.ghost.io', required: true },
    ],
  },
  hashnode: {
    platform: 'hashnode',
    label: 'Hashnode',
    kind: 'article',
    requiredProviders: ['hashnode'],
    optionFields: [
      { key: 'publicationId', label: 'Publication ID', required: true },
    ],
  },
  devto: {
    platform: 'devto',
    label: 'Dev.to',
    kind: 'article',
    requiredProviders: ['devto'],
    optionFields: [],
  },
}
