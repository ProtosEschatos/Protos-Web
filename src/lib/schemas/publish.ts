import { z } from 'zod'

export const shortPostSchema = z.object({
  platform: z.enum(['bluesky', 'mastodon', 'threads', 'facebook', 'instagram']),
  text: z.string().min(1).max(2200),
  linkUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  imageUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  imageAlt: z.string().max(400).optional(),
  options: z.record(z.string(), z.string()).default({}),
})

export const articleSchema = z.object({
  platform: z.enum(['ghost', 'hashnode', 'devto']),
  title: z.string().min(3).max(180),
  markdown: z.string().min(20),
  excerpt: z.string().max(500).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  tags: z.array(z.string().min(1).max(40)).max(5).default([]),
  coverImageUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  published: z.boolean().default(true),
  options: z.record(z.string(), z.string()).default({}),
})

export type ShortPostSchema = z.infer<typeof shortPostSchema>
export type ArticleSchema = z.infer<typeof articleSchema>
