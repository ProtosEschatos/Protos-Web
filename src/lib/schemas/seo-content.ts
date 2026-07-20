import { z } from 'zod'

export const SEO_LOCALES = ['hr', 'en', 'de', 'it', 'es', 'sr'] as const
export type SeoLocale = (typeof SEO_LOCALES)[number]

export const PUBLISHING_PLATFORMS = [
  'medium',
  'substack',
  'blogger',
  'tumblr',
  'aboutme',
  'payhip',
] as const
export type PublishingPlatform = (typeof PUBLISHING_PLATFORMS)[number]

export const SOCIAL_PLATFORMS = [
  'youtube',
  'youtube-shorts',
  'instagram',
  'instagram-reels',
  'facebook',
  'tiktok',
  'linkedin',
  'x-twitter',
] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const CONTENT_TONES = [
  'profesionalan',
  'prijateljski',
  'tehnički',
  'igran',
  'inspirativan',
  'edukacijski',
] as const

export const seoBriefRequest = z.object({
  topic: z.string().min(5).max(600),
  locale: z.enum(SEO_LOCALES).default('hr'),
  tone: z.enum(CONTENT_TONES).default('profesionalan'),
  audience: z.string().max(200).optional(),
  cta: z.string().max(200).optional(),
  keywords: z.array(z.string().min(1).max(60)).max(10).optional(),
  socialPlatforms: z.array(z.enum(SOCIAL_PLATFORMS)).min(1).max(SOCIAL_PLATFORMS.length),
})

export type SeoBriefRequest = z.infer<typeof seoBriefRequest>

/** LLM response shape for /api/admin/ai/seo-brief. */
export const seoBriefResponse = z.object({
  title: z.string().min(3).max(140),
  metaDescription: z.string().min(20).max(320),
  ogTitle: z.string().min(3).max(140),
  ogDescription: z.string().min(20).max(320),
  slug: z.string().min(3).max(120),
  keywords: z.array(z.string().min(1).max(60)).min(3).max(30),
  hashtags: z.array(z.string().min(2).max(60)).min(3).max(30),
  socialCaptions: z.record(z.enum(SOCIAL_PLATFORMS), z.string().min(10).max(2200)),
  ctaLine: z.string().max(240).optional(),
})

export type SeoBriefResponse = z.infer<typeof seoBriefResponse>

export const articleRewriteRequest = z.object({
  sourceTitle: z.string().min(3).max(240),
  sourceContent: z.string().min(100).max(30_000),
  sourceLocale: z.enum(SEO_LOCALES).default('hr'),
  targetLocale: z.enum(SEO_LOCALES).default('hr'),
  platforms: z.array(z.enum(PUBLISHING_PLATFORMS)).min(1).max(PUBLISHING_PLATFORMS.length),
  tone: z.enum(CONTENT_TONES).default('profesionalan'),
  keepLinkTo: z.string().url().optional(),
})

export type ArticleRewriteRequest = z.infer<typeof articleRewriteRequest>

const platformVariant = z.object({
  title: z.string().min(3).max(240),
  subtitle: z.string().max(240).optional(),
  body: z.string().min(50).max(50_000),
  tags: z.array(z.string().min(1).max(60)).min(1).max(30),
  excerpt: z.string().max(400).optional(),
  publishingHints: z.string().max(600).optional(),
})

export type PlatformVariant = z.infer<typeof platformVariant>

export const articleRewriteResponse = z.object({
  variants: z.record(z.enum(PUBLISHING_PLATFORMS), platformVariant),
})

export type ArticleRewriteResponse = z.infer<typeof articleRewriteResponse>
