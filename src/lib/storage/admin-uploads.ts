import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const ADMIN_UPLOADS_BUCKET = 'admin-uploads'

/**
 * Category → subfolder convention. Keeps browsing bucket manually sane.
 */
const CATEGORY_PREFIX: Record<string, string> = {
  image: 'images',
  video: 'videos',
  texture: 'textures',
  audio: 'audio',
  model_glb: 'models',
  model_gltf: 'models',
  document: 'docs',
  other: 'other',
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Build a deterministic, non-guessable storage path so re-uploads of the
 * same filename don't collide, and so `?download=<original>` reads nicely.
 */
export function buildStoragePath(category: string, originalFilename: string): string {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const rand = crypto.randomUUID().slice(0, 8)
  const prefix = CATEGORY_PREFIX[category] ?? 'other'
  const safe = slugify(originalFilename) || 'file'
  return `${prefix}/${yyyy}/${mm}/${rand}-${safe}`
}

/**
 * Signed upload URL — the browser PUTs directly to Supabase, bypassing
 * Next.js/Vercel body-size limits (~4.5MB). Valid for a single upload.
 */
export async function createSignedUploadUrl(storagePath: string): Promise<
  | { success: true; token: string; path: string; url: string }
  | { success: false; error: string }
> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }
  const { data, error } = await supabaseAdmin.storage
    .from(ADMIN_UPLOADS_BUCKET)
    .createSignedUploadUrl(storagePath)
  if (error || !data) return { success: false, error: error?.message ?? 'unknown error' }
  return { success: true, token: data.token, path: data.path, url: data.signedUrl }
}

/**
 * Signed read URL, for private consumption from an admin UI or server-side
 * fetch. `expiresIn` is in seconds; keep short (default 1h) since we mint on demand.
 */
export async function createSignedReadUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }
  const { data, error } = await supabaseAdmin.storage
    .from(ADMIN_UPLOADS_BUCKET)
    .createSignedUrl(storagePath, expiresIn)
  if (error || !data) return { success: false, error: error?.message ?? 'unknown error' }
  return { success: true, url: data.signedUrl }
}

export async function deleteObject(
  storagePath: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!supabaseAdmin) return { success: false, error: 'Supabase admin not configured' }
  const { error } = await supabaseAdmin.storage
    .from(ADMIN_UPLOADS_BUCKET)
    .remove([storagePath])
  if (error) return { success: false, error: error.message }
  return { success: true }
}
