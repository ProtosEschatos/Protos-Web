import { supabase } from '@/lib/supabase'
import type { BlogPost, BlogSlugEntry } from '@/types/blog'

export async function getBlogPosts(limit = 20, language = 'hr'): Promise<BlogPost[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, created_at, language, author_slug')
    .eq('is_published', true)
    .eq('language', language)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getBlogPosts error:', error)
    return []
  }

  return (data ?? []).map((post) => ({
    ...post,
    created_at: post.created_at ?? '',
    author_slug: (post.author_slug as BlogPost['author_slug']) ?? 'dario',
  }))
}

export async function getBlogPostBySlug(
  slug: string,
  language = 'hr',
): Promise<BlogPost | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, created_at, language, author_slug')
    .eq('is_published', true)
    .eq('language', language)
    .eq('slug', slug)
    .maybeSingle()

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
}

export type AdjacentBlogPosts = {
  previous: Pick<BlogPost, 'slug' | 'title'> | null
  next: Pick<BlogPost, 'slug' | 'title'> | null
}

/** Chronological neighbors: `previous` = older post, `next` = newer post. */
export async function getAdjacentBlogPosts(
  slug: string,
  language = 'hr',
): Promise<AdjacentBlogPosts> {
  const posts = await getBlogPosts(100, language)
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return { previous: null, next: null }

  const previous =
    index < posts.length - 1
      ? { slug: posts[index + 1].slug, title: posts[index + 1].title }
      : null
  const next = index > 0 ? { slug: posts[index - 1].slug, title: posts[index - 1].title } : null

  return { previous, next }
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
