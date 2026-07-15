import { supabase } from '@/lib/supabase'
import type { BlogPost, BlogSlugEntry } from '@/types/blog'

const QUERY_TIMEOUT_MS = 15_000

async function withQueryTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${QUERY_TIMEOUT_MS}ms`)), QUERY_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function getBlogPosts(limit = 20, language = 'hr'): Promise<BlogPost[]> {
  if (!supabase) return []

  try {
    const { data, error } = await withQueryTimeout(
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, created_at, language, author_slug')
        .eq('is_published', true)
        .eq('language', language)
        .order('created_at', { ascending: false })
        .limit(limit),
      'getBlogPosts',
    )

    if (error) {
      console.error('getBlogPosts error:', error)
      return []
    }

    return (data ?? []).map((post) => ({
      ...post,
      created_at: post.created_at ?? '',
      author_slug: (post.author_slug as BlogPost['author_slug']) ?? 'dario',
    }))
  } catch (error) {
    console.error('getBlogPosts failed:', error)
    return []
  }
}

export async function getBlogPostBySlug(
  slug: string,
  language = 'hr',
): Promise<BlogPost | null> {
  if (!supabase) return null

  try {
    const { data, error } = await withQueryTimeout(
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, created_at, language, author_slug')
        .eq('is_published', true)
        .eq('language', language)
        .eq('slug', slug)
        .maybeSingle(),
      `getBlogPostBySlug(${slug})`,
    )

    if (error) {
      console.error('getBlogPostBySlug error:', error)
      return null
    }

    if (!data) return null

    return {
      ...data,
      created_at: data.created_at ?? '',
      author_slug: (data.author_slug as BlogPost['author_slug']) ?? 'dario',
    }
  } catch (error) {
    console.error('getBlogPostBySlug failed:', error)
    return null
  }
}

export async function getAllBlogSlugs(): Promise<BlogSlugEntry[]> {
  if (!supabase) return []

  try {
    const { data, error } = await withQueryTimeout(
      supabase
        .from('blog_posts')
        .select('slug, language, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      'getAllBlogSlugs',
    )

    if (error) {
      console.error('getAllBlogSlugs error:', error)
      return []
    }

    return (data ?? []).map((row) => ({
      slug: row.slug,
      language: row.language,
      updated_at: row.created_at ?? new Date().toISOString(),
    }))
  } catch (error) {
    console.error('getAllBlogSlugs failed:', error)
    return []
  }
}
