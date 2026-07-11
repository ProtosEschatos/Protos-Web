import { requireAdmin } from '@/lib/auth/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { AdminBlogPost } from '@/types/admin-blog'

export async function adminListBlogPosts(language = 'hr'): Promise<AdminBlogPost[]> {
  await requireAdmin()
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, language, is_published, created_at')
    .eq('language', language)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('adminListBlogPosts:', error)
    return []
  }
  return data ?? []
}

export async function adminGetBlogPost(id: string): Promise<AdminBlogPost | null> {
  await requireAdmin()
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, language, is_published, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data
}
