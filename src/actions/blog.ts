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

  return (data ?? []).map((post) => ({ ...post, created_at: post.created_at ?? '' }))
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

  if (!data) return null

  return { ...data, created_at: data.created_at ?? '' }
}

export type AdjacentBlogPost = { slug: string; title: string }

export type BlogNeighbors = {
  previous: AdjacentBlogPost | null
  next: AdjacentBlogPost | null
}

/**
 * Neighboring posts for prev/next navigation, within the same language.
 * `previous` = newer post, `next` = older post (list is newest-first).
 */
export async function getAdjacentBlogPosts(
  createdAt: string,
  language = 'hr',
): Promise<BlogNeighbors> {
  if (!supabase) return { previous: null, next: null }

  const [newer, older] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('is_published', true)
      .eq('language', language)
      .gt('created_at', createdAt)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('is_published', true)
      .eq('language', language)
      .lt('created_at', createdAt)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    previous: newer.data ? { slug: newer.data.slug, title: newer.data.title } : null,
    next: older.data ? { slug: older.data.slug, title: older.data.title } : null,
  }
}

export async function getBlogSlugLocales(slug: string): Promise<string[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('language')
    .eq('is_published', true)
    .eq('slug', slug)

  if (error) {
    console.error('getBlogSlugLocales error:', error)
    return []
  }

  return [...new Set((data ?? []).map((row) => row.language))]
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
    updated_at: row.created_at ?? new Date().toISOString(),
  }))
}
