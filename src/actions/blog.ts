'use server'

import { supabase } from '@/lib/supabase'

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  created_at: string
  language: string
}

export type BlogSlugEntry = {
  slug: string
  language: string
  updated_at: string
}

export async function getBlogPosts(limit = 20, language = 'hr'): Promise<BlogPost[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, created_at, language')
    .eq('is_published', true)
    .eq('language', language)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getBlogPosts error:', error)
    return []
  }

  return data ?? []
}

export async function getBlogPostBySlug(
  slug: string,
  language = 'hr',
): Promise<BlogPost | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, created_at, language')
    .eq('is_published', true)
    .eq('language', language)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getBlogPostBySlug error:', error)
    return null
  }

  return data
}

export async function getAllBlogSlugs(): Promise<BlogSlugEntry[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, language, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllBlogSlugs error:', error)
    return []
  }

  return (data ?? []).map((row) => ({
    slug: row.slug,
    language: row.language,
    updated_at: row.created_at,
  }))
}
