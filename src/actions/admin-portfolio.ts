'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'
import type { PortfolioFormInput } from '@/types/admin-portfolio'

type PortfolioInsert = Database['public']['Tables']['portfolio_items']['Insert']
type PortfolioUpdate = Database['public']['Tables']['portfolio_items']['Update']

export async function adminCreatePortfolioItem(
  input: PortfolioFormInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const row: PortfolioInsert = {
    title: input.title.trim(),
    tag: input.tag?.trim() || null,
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    project_url: input.project_url?.trim() || null,
    featured: input.featured,
    active: input.active,
    sort_order: input.sort_order,
    language: input.language,
  }

  const { data, error } = await supabaseAdmin.from('portfolio_items').insert(row).select('id').single()
  if (error) return { success: false, error: error.message }

  revalidatePath('/portfolio')
  revalidatePath('/portfolio-showcase')
  revalidatePath('/')
  return { success: true, id: data.id }
}

export async function adminUpdatePortfolioItem(
  id: string,
  input: PortfolioFormInput,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const row: PortfolioUpdate = {
    title: input.title.trim(),
    tag: input.tag?.trim() || null,
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    project_url: input.project_url?.trim() || null,
    featured: input.featured,
    active: input.active,
    sort_order: input.sort_order,
    language: input.language,
  }

  const { error } = await supabaseAdmin.from('portfolio_items').update(row).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/portfolio')
  revalidatePath('/portfolio-showcase')
  revalidatePath('/')
  return { success: true }
}

export async function adminDeletePortfolioItem(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const { error } = await supabaseAdmin.from('portfolio_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/portfolio')
  revalidatePath('/portfolio-showcase')
  revalidatePath('/')
  return { success: true }
}
