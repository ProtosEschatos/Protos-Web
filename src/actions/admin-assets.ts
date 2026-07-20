'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  ADMIN_UPLOADS_BUCKET,
  buildStoragePath,
  createSignedReadUrl,
  createSignedUploadUrl,
  deleteObject,
} from '@/lib/storage/admin-uploads'

// ── Types ────────────────────────────────────────────────────────────────

export const ADMIN_ASSET_CATEGORIES = [
  'image',
  'video',
  'model_glb',
  'model_gltf',
  'texture',
  'audio',
  'document',
  'other',
] as const

export type AdminAssetCategory = (typeof ADMIN_ASSET_CATEGORIES)[number]

export type AdminAsset = {
  id: string
  category: AdminAssetCategory
  bucket: string
  storagePath: string
  mimeType: string | null
  sizeBytes: number | null
  width: number | null
  height: number | null
  durationSeconds: number | null
  originalFilename: string | null
  label: string | null
  tags: string[]
  isPublished: boolean
  uploadedBy: string | null
  createdAt: string
  updatedAt: string
}

type Result<T> = { success: true; data: T } | { success: false; error: string }

// ── Schemas ──────────────────────────────────────────────────────────────

const MAX_BYTES: Record<AdminAssetCategory, number> = {
  image: 15 * 1024 * 1024, // 15 MB
  texture: 15 * 1024 * 1024,
  audio: 30 * 1024 * 1024,
  document: 30 * 1024 * 1024,
  model_glb: 50 * 1024 * 1024,
  model_gltf: 50 * 1024 * 1024,
  video: 150 * 1024 * 1024,
  other: 30 * 1024 * 1024,
}

const CreateUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(255),
  sizeBytes: z.number().int().positive(),
  category: z.enum(ADMIN_ASSET_CATEGORIES),
})

const FinalizeSchema = z.object({
  storagePath: z.string().min(1),
  category: z.enum(ADMIN_ASSET_CATEGORIES),
  mimeType: z.string().min(1).max(255),
  sizeBytes: z.number().int().positive(),
  originalFilename: z.string().min(1).max(255),
  label: z.string().max(200).nullable().optional(),
  tags: z.array(z.string().min(1).max(64)).max(30).default([]),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  durationSeconds: z.number().positive().nullable().optional(),
  isPublished: z.boolean().default(false),
})

const UpdateSchema = z.object({
  id: z.string().uuid(),
  label: z.string().max(200).nullable().optional(),
  tags: z.array(z.string().min(1).max(64)).max(30).optional(),
  isPublished: z.boolean().optional(),
})

const ListSchema = z.object({
  category: z.enum(ADMIN_ASSET_CATEGORIES).optional(),
  tag: z.string().min(1).max(64).optional(),
  limit: z.number().int().min(1).max(200).default(60),
  offset: z.number().int().min(0).default(0),
})

// ── Row mapper ───────────────────────────────────────────────────────────

type DbRow = {
  id: string
  category: string
  bucket: string
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  width: number | null
  height: number | null
  duration_seconds: number | null
  original_filename: string | null
  label: string | null
  tags: string[]
  is_published: boolean
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

function toAsset(row: DbRow): AdminAsset {
  return {
    id: row.id,
    category: row.category as AdminAssetCategory,
    bucket: row.bucket,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    width: row.width,
    height: row.height,
    durationSeconds: row.duration_seconds,
    originalFilename: row.original_filename,
    label: row.label,
    tags: row.tags ?? [],
    isPublished: row.is_published,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ── Actions ──────────────────────────────────────────────────────────────

/** Step 1 (browser-side upload flow): mint a one-shot upload URL. */
export async function adminCreateAssetUpload(
  input: z.input<typeof CreateUploadSchema>,
): Promise<Result<{ token: string; storagePath: string; signedUrl: string }>> {
  await requireAdmin()
  const parsed = CreateUploadSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Neispravan unos' }

  const { filename, sizeBytes, category } = parsed.data
  const cap = MAX_BYTES[category]
  if (sizeBytes > cap) {
    const mb = (cap / (1024 * 1024)).toFixed(0)
    return { success: false, error: `Datoteka prelazi ${mb} MB limit za kategoriju ${category}` }
  }

  const storagePath = buildStoragePath(category, filename)
  const signed = await createSignedUploadUrl(storagePath)
  if (!signed.success) return { success: false, error: signed.error }

  return {
    success: true,
    data: { token: signed.token, storagePath: signed.path, signedUrl: signed.url },
  }
}

/** Step 2: after browser PUT succeeds, insert metadata row. */
export async function adminFinalizeAssetUpload(
  input: z.input<typeof FinalizeSchema>,
): Promise<Result<AdminAsset>> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }

  const parsed = FinalizeSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Neispravan unos' }

  const {
    storagePath,
    category,
    mimeType,
    sizeBytes,
    originalFilename,
    label,
    tags,
    width,
    height,
    durationSeconds,
    isPublished,
  } = parsed.data

  const insertRow: Record<string, unknown> = {
    category,
    bucket: ADMIN_UPLOADS_BUCKET,
    storage_path: storagePath,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    original_filename: originalFilename,
    label: label ?? null,
    tags,
    width: width ?? null,
    height: height ?? null,
    duration_seconds: durationSeconds ?? null,
    is_published: isPublished,
    uploaded_by: 'admin',
  }

  const { data, error } = await supabaseAdmin
    .from('admin_assets')
    .insert(insertRow as never)
    .select('*')
    .single()

  if (error || !data) {
    // Best-effort cleanup: if the metadata insert fails, remove the object.
    await deleteObject(storagePath)
    return { success: false, error: error?.message ?? 'Neuspješan zapis u bazi' }
  }

  revalidatePath('/admin/assets')
  revalidatePath('/admin/konfigurator')

  return { success: true, data: toAsset(data as DbRow) }
}

export async function adminListAssets(
  input: z.input<typeof ListSchema>,
): Promise<Result<{ assets: AdminAsset[]; total: number }>> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }

  const parsed = ListSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Neispravan unos' }

  const { category, tag, limit, offset } = parsed.data
  let q = supabaseAdmin
    .from('admin_assets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) q = q.eq('category', category)
  if (tag) q = q.contains('tags', [tag])

  const { data, count, error } = await q
  if (error) return { success: false, error: error.message }

  return {
    success: true,
    data: { assets: ((data ?? []) as DbRow[]).map(toAsset), total: count ?? 0 },
  }
}

export async function adminUpdateAsset(
  input: z.input<typeof UpdateSchema>,
): Promise<Result<AdminAsset>> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }

  const parsed = UpdateSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Neispravan unos' }

  const { id, ...patch } = parsed.data
  const dbPatch: Record<string, unknown> = {}
  if (patch.label !== undefined) dbPatch.label = patch.label
  if (patch.tags !== undefined) dbPatch.tags = patch.tags
  if (patch.isPublished !== undefined) dbPatch.is_published = patch.isPublished

  const { data, error } = await supabaseAdmin
    .from('admin_assets')
    .update(dbPatch as never)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) return { success: false, error: error?.message ?? 'Zapis ne postoji' }

  revalidatePath('/admin/assets')
  revalidatePath('/admin/konfigurator')

  return { success: true, data: toAsset(data as DbRow) }
}

export async function adminDeleteAsset(id: string): Promise<Result<null>> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }
  if (!z.string().uuid().safeParse(id).success) return { success: false, error: 'Neispravan id' }

  const { data: row, error: readError } = await supabaseAdmin
    .from('admin_assets')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (readError || !row) return { success: false, error: readError?.message ?? 'Zapis ne postoji' }

  await deleteObject((row as { storage_path: string }).storage_path)

  const { error } = await supabaseAdmin.from('admin_assets').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/assets')
  revalidatePath('/admin/konfigurator')

  return { success: true, data: null }
}

/**
 * Mint a signed read URL for an admin asset. Used by the admin UI (asset
 * grid thumbnails, scene texture/model loading) and by the public helper.
 */
export async function adminGetAssetSignedUrl(
  id: string,
  expiresIn = 3600,
): Promise<Result<{ url: string }>> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }
  if (!z.string().uuid().safeParse(id).success) return { success: false, error: 'Neispravan id' }

  const { data: row, error } = await supabaseAdmin
    .from('admin_assets')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (error || !row) return { success: false, error: error?.message ?? 'Zapis ne postoji' }

  const signed = await createSignedReadUrl(
    (row as { storage_path: string }).storage_path,
    expiresIn,
  )
  if (!signed.success) return { success: false, error: signed.error }
  return { success: true, data: { url: signed.url } }
}
