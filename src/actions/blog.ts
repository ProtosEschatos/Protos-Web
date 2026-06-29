'use server'

import { supabase } from '@/lib/supabase'

export async function getBlogPosts(limit = 20) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getBlogPosts error:', error)
    return []
  }

  return data ?? []
}
