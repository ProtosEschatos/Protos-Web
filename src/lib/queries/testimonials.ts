import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/database.types'

export type TestimonialRow = Tables<'testimonials'>

/**
 * Testimonials are currently only translated for `hr`, so every other
 * locale falls back to the Croatian content rather than showing nothing.
 */
export async function getTestimonials(language = 'hr', limit = 4): Promise<TestimonialRow[]> {
  if (!supabase) return []

  const fetchByLanguage = async (lang: string) => {
    const { data, error } = await supabase!
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .eq('language', lang)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('getTestimonials error:', error)
      return []
    }
    return data ?? []
  }

  const rows = await fetchByLanguage(language)
  if (rows.length > 0 || language === 'hr') return rows

  return fetchByLanguage('hr')
}
