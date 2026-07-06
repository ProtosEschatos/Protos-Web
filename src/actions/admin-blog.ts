'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import { slugify } from '@/lib/slug'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'
import type { BlogFormInput } from '@/types/admin-blog'

type BlogInsert = Database['public']['Tables']['blog_posts']['Insert']
type BlogUpdate = Database['public']['Tables']['blog_posts']['Update']

export async function adminCreateBlogPost(
  input: BlogFormInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const slug = (input.slug?.trim() || slugify(input.title)) || 'post'
  const row: BlogInsert = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt?.trim() || null,
    content: input.content?.trim() || null,
    language: input.language,
    is_published: input.is_published,
  }

  const { data, error } = await supabaseAdmin.from('blog_posts').insert(row).select('id').single()
  if (error) return { success: false, error: error.message }

  revalidatePath('/blog')
  revalidatePath('/')
  return { success: true, id: data.id }
}

export async function adminUpdateBlogPost(
  id: string,
  input: BlogFormInput,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const row: BlogUpdate = {
    title: input.title.trim(),
    slug: (input.slug?.trim() || slugify(input.title)) || 'post',
    excerpt: input.excerpt?.trim() || null,
    content: input.content?.trim() || null,
    language: input.language,
    is_published: input.is_published,
  }

  const { error } = await supabaseAdmin.from('blog_posts').update(row).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/blog')
  revalidatePath('/')
  return { success: true }
}

export async function adminDeleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  if (!supabaseAdmin) return { success: false, error: 'Supabase nije konfiguriran' }

  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/blog')
  revalidatePath('/')
  return { success: true }
}
