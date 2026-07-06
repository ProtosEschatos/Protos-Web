'use server'

import { requireAdmin } from '@/lib/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'

const BUCKET = 'showcase'
const MAX_BYTES = 5 * 1024 * 1024

export async function adminUploadPortfolioImage(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { success: false, error: 'Datoteka nije pronađena' }
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Dozvoljene su samo slike' }
  }

  if (file.size > MAX_BYTES) {
    return { success: false, error: 'Maksimalna veličina je 5 MB' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return { success: true, url: data.publicUrl }
}
