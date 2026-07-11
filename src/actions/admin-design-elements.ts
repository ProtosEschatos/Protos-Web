'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'

type DesignInsert = Database['public']['Tables']['design_elements']['Insert']
type DesignRow = Database['public']['Tables']['design_elements']['Row']

export type DesignElementInput = {
  category: string
  name: string
  description?: string
  source_board?: string
  tags?: string[]
  sort_order?: number
  storage_path?: string
  image_url?: string
}

export async function adminListDesignElements(): Promise<{
  success: boolean
  items?: DesignRow[]
  error?: string
}> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const { data, error } = await supabaseAdmin
    .from('design_elements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, items: data ?? [] }
}

export async function adminCreateDesignElement(
  input: DesignElementInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const row: DesignInsert = {
    category: input.category.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    source_board: input.source_board?.trim() || null,
    tags: input.tags ?? [],
    sort_order: input.sort_order ?? 0,
    storage_path: input.storage_path?.trim() || null,
    image_url: input.image_url?.trim() || null,
  }

  const { data, error } = await supabaseAdmin.from('design_elements').insert(row).select('id').single()
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/integrations')
  return { success: true, id: data.id }
}

export async function adminUpdateDesignElement(
  id: string,
  input: DesignElementInput,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const { error } = await supabaseAdmin
    .from('design_elements')
    .update({
      category: input.category.trim(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      source_board: input.source_board?.trim() || null,
      tags: input.tags ?? [],
      sort_order: input.sort_order ?? 0,
      storage_path: input.storage_path?.trim() || null,
      image_url: input.image_url?.trim() || null,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/integrations')
  return { success: true }
}

export async function adminDeleteDesignElement(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const { error } = await supabaseAdmin.from('design_elements').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/integrations')
  return { success: true }
}

export async function adminUploadDesignAsset(
  formData: FormData,
): Promise<{ success: boolean; storagePath?: string; publicUrl?: string; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const file = formData.get('file')
  const category = String(formData.get('category') ?? 'misc').trim() || 'misc'

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Odaberi datoteku za upload' }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${category}/${Date.now()}-${safeName}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabaseAdmin.storage
    .from('design-assets')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: urlData } = supabaseAdmin.storage.from('design-assets').getPublicUrl(storagePath)

  revalidatePath('/admin/integrations')
  return { success: true, storagePath, publicUrl: urlData.publicUrl }
}
