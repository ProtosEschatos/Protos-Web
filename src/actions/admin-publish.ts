'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getActiveApiKey } from '@/lib/queries/admin/api-keys'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { recordAudit } from '@/lib/audit/record'
import { runArticlePublisher, runShortPublisher } from '@/lib/publishers'
import { PUBLISHERS } from '@/lib/publishers/meta-catalog'
import type { PublishPlatform } from '@/lib/publishers/types'
import {
  articleSchema,
  shortPostSchema,
  type ArticleSchema,
  type ShortPostSchema,
} from '@/lib/schemas/publish'

type PublishActionResult =
  | { ok: true; remoteUrl: string; remoteId: string }
  | { ok: false; error: string }

const CREDENTIAL_KEYS: Record<PublishPlatform, string> = {
  bluesky: 'appPassword',
  mastodon: 'accessToken',
  threads: 'accessToken',
  facebook: 'accessToken',
  instagram: 'accessToken',
  ghost: 'adminApiKey',
  hashnode: 'pat',
  devto: 'apiKey',
}

async function resolveSecrets(platform: PublishPlatform): Promise<Record<string, string>> {
  const meta = PUBLISHERS[platform]
  const secrets: Record<string, string> = {}
  for (const provider of meta.requiredProviders) {
    const value = await getActiveApiKey(provider)
    if (!value) {
      throw new Error(`Nema aktivnog ključa za providera "${provider}" u vault-u`)
    }
    secrets[CREDENTIAL_KEYS[platform]] = value
  }
  return secrets
}

export async function adminPublishShort(input: ShortPostSchema): Promise<PublishActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = shortPostSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  const data = parsed.data

  try {
    const secrets = await resolveSecrets(data.platform)
    const result = await runShortPublisher(
      data.platform,
      {
        text: data.text,
        linkUrl: data.linkUrl,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
      },
      { secrets, options: data.options },
    )
    await recordPublish({
      platform: data.platform,
      kind: 'short',
      title: null,
      bodyPreview: data.text.slice(0, 240),
      status: 'ok',
      remoteId: result.remoteId,
      remoteUrl: result.remoteUrl,
      request: { text: data.text, options: data.options },
      response: result.response,
    })
    await recordAudit({
      event: `publish.${data.platform}.ok`,
      source: 'admin-publish',
      payload: { remoteUrl: result.remoteUrl },
    })
    revalidatePath('/admin/publish')
    revalidatePath('/admin/audit')
    return { ok: true, remoteId: result.remoteId, remoteUrl: result.remoteUrl }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await recordPublish({
      platform: data.platform,
      kind: 'short',
      title: null,
      bodyPreview: data.text.slice(0, 240),
      status: 'error',
      errorMessage: message,
      request: { text: data.text, options: data.options },
      response: {},
    })
    await recordAudit({
      event: `publish.${data.platform}.error`,
      source: 'admin-publish',
      payload: { error: message },
    })
    return { ok: false, error: message }
  }
}

export async function adminPublishArticle(input: ArticleSchema): Promise<PublishActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = articleSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  const data = parsed.data

  try {
    const secrets = await resolveSecrets(data.platform)
    const result = await runArticlePublisher(
      data.platform,
      {
        title: data.title,
        markdown: data.markdown,
        excerpt: data.excerpt,
        canonicalUrl: data.canonicalUrl,
        tags: data.tags,
        coverImageUrl: data.coverImageUrl,
        published: data.published,
      },
      { secrets, options: data.options },
    )
    await recordPublish({
      platform: data.platform,
      kind: 'article',
      title: data.title,
      bodyPreview: data.markdown.slice(0, 300),
      status: 'ok',
      remoteId: result.remoteId,
      remoteUrl: result.remoteUrl,
      request: {
        title: data.title,
        tags: data.tags,
        canonicalUrl: data.canonicalUrl,
        options: data.options,
      },
      response: result.response,
    })
    await recordAudit({
      event: `publish.${data.platform}.ok`,
      source: 'admin-publish',
      payload: { remoteUrl: result.remoteUrl, title: data.title },
    })
    revalidatePath('/admin/publish')
    revalidatePath('/admin/audit')
    return { ok: true, remoteId: result.remoteId, remoteUrl: result.remoteUrl }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await recordPublish({
      platform: data.platform,
      kind: 'article',
      title: data.title,
      bodyPreview: data.markdown.slice(0, 300),
      status: 'error',
      errorMessage: message,
      request: {
        title: data.title,
        tags: data.tags,
        canonicalUrl: data.canonicalUrl,
        options: data.options,
      },
      response: {},
    })
    await recordAudit({
      event: `publish.${data.platform}.error`,
      source: 'admin-publish',
      payload: { error: message, title: data.title },
    })
    return { ok: false, error: message }
  }
}

type RecordInput = {
  platform: PublishPlatform
  kind: 'short' | 'article'
  title: string | null
  bodyPreview: string
  status: 'ok' | 'error'
  remoteId?: string
  remoteUrl?: string
  errorMessage?: string
  request: Record<string, unknown>
  response: Record<string, unknown>
}

async function recordPublish(input: RecordInput): Promise<void> {
  if (!supabaseAdmin) return
  try {
    await supabaseAdmin.from('published_posts').insert({
      platform: input.platform,
      kind: input.kind,
      title: input.title,
      body_preview: input.bodyPreview,
      status: input.status,
      remote_id: input.remoteId ?? null,
      remote_url: input.remoteUrl ?? null,
      error_message: input.errorMessage ?? null,
      request_payload: input.request as never,
      response_payload: input.response as never,
    })
  } catch (err) {
    console.warn('[admin-publish] recordPublish failed:', err)
  }
}
