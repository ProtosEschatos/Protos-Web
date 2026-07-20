export type PublishKind = 'short' | 'article'

export type PublishPlatform =
  | 'bluesky'
  | 'mastodon'
  | 'threads'
  | 'facebook'
  | 'instagram'
  | 'ghost'
  | 'hashnode'
  | 'devto'

export type ShortPostInput = {
  /** Full post text (already localized, truncated to platform limits upstream). */
  text: string
  /** Optional canonical URL to attach as link card / OG preview. */
  linkUrl?: string
  /** Optional public image URL (already uploaded, e.g. Supabase Storage). */
  imageUrl?: string
  /** Optional alt-text (accessibility, mandatory on Bluesky if imageUrl set). */
  imageAlt?: string
}

export type ArticleInput = {
  title: string
  /** Markdown body — adapters translate to native format if needed. */
  markdown: string
  /** Short SEO description / dek — used for meta description or subtitle. */
  excerpt?: string
  /** Optional canonical URL — signals original source to indexers. */
  canonicalUrl?: string
  /** Tags / labels (max 5 recommended). */
  tags?: string[]
  /** Optional cover image URL. */
  coverImageUrl?: string
  /** Publish immediately (true) or save as draft (false). */
  published?: boolean
}

export type PublishResult = {
  /** Platform-native ID of the created post (used for dedup + linking). */
  remoteId: string
  /** Direct URL to the live post — surfaced in the admin UI. */
  remoteUrl: string
  /** Verbatim response body — stored for debugging. */
  response: Record<string, unknown>
}

export type PublisherContext = {
  /** Runtime credential(s) resolved from admin_api_keys vault. */
  secrets: Record<string, string>
  /** Optional extra config from the request (e.g. selected mastodon instance). */
  options?: Record<string, string | undefined>
}
