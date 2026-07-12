import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/database.types'

export type PricingPlanRow = Tables<'pricing_plans'>

/**
 * Pricing plans are currently only translated for `hr`, so every other
 * locale falls back to the Croatian content rather than showing nothing.
 */
export async function getPricingPlans(language = 'hr'): Promise<PricingPlanRow[]> {
  if (!supabase) return []

  const fetchByLanguage = async (lang: string) => {
    const { data, error } = await supabase!
      .from('pricing_plans')
      .select('*')
      .eq('active', true)
      .eq('language', lang)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('getPricingPlans error:', error)
      return []
    }
    return data ?? []
  }

  const rows = await fetchByLanguage(language)
  if (rows.length > 0 || language === 'hr') return rows

  return fetchByLanguage('hr')
}
