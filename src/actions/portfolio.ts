'use server'

import { supabase } from '@/lib/supabase'

export type PortfolioItem = {
  id: string
  title: string
  tag: string | null
  description: string | null
  image_url: string | null
  project_url: string | null
  featured: boolean | null
  sort_order: number | null
  language: string
}

export async function getPortfolioItems(
  language = 'hr',
  limit = 12,
): Promise<PortfolioItem[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('id, title, tag, description, image_url, project_url, featured, sort_order, language')
    .eq('active', true)
    .eq('language', language)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('getPortfolioItems error:', error)
    return []
  }

  return data ?? []
}
