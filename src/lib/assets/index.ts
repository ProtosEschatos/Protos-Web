import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSignedReadUrl } from '@/lib/storage/admin-uploads'

export type PublishedAsset = {
  id: string
  category: string
  storagePath: string
  mimeType: string | null
  width: number | null
  height: number | null
  durationSeconds: number | null
  label: string | null
  tags: string[]
  originalFilename: string | null
  /** Signed URL for direct <img>/<video>/useGLTF consumption. */
  url: string
}

export type PublishedAssetFilter = {
  tag?: string
  category?: string
  limit?: number
}

/**
 * Return published admin assets suitable for public-site rendering.
 *
 * The metadata row lives in Postgres (readable by anon via RLS thanks to the
 * `is_published = true` policy), but the object itself sits in the private
 * `admin-uploads` bucket. We mint a short-lived signed URL server-side and
 * hand it to the caller. Because this file is server-only, the service-role
 * key never crosses the client boundary.
 *
 * Typical usage from a Server Component:
 *
 *   const heroImages = await getPublishedAssets({ tag: 'hero-slider', category: 'image' })
 *   return heroImages.map(a => <Image key={a.id} src={a.url} width={a.width!} height={a.height!} />)
 */
export async function getPublishedAssets(
  filter: PublishedAssetFilter = {},
): Promise<PublishedAsset[]> {
  if (!supabaseAdmin) return []

  const { tag, category, limit = 60 } = filter
  let q = supabaseAdmin
    .from('admin_assets')
    .select(
      'id, category, storage_path, mime_type, width, height, duration_seconds, label, tags, original_filename',
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category) q = q.eq('category', category)
  if (tag) q = q.contains('tags', [tag])

  const { data, error } = await q
  if (error || !data) return []

  type Row = {
    id: string
    category: string
    storage_path: string
    mime_type: string | null
    width: number | null
    height: number | null
    duration_seconds: number | null
    label: string | null
    tags: string[]
    original_filename: string | null
  }

  const rows = data as Row[]

  const results = await Promise.all(
    rows.map(async (row) => {
      const signed = await createSignedReadUrl(row.storage_path, 3600)
      if (!signed.success) return null
      return {
        id: row.id,
        category: row.category,
        storagePath: row.storage_path,
        mimeType: row.mime_type,
        width: row.width,
        height: row.height,
        durationSeconds: row.duration_seconds,
        label: row.label,
        tags: row.tags ?? [],
        originalFilename: row.original_filename,
        url: signed.url,
      } satisfies PublishedAsset
    }),
  )

  return results.filter((a): a is PublishedAsset => a !== null)
}
