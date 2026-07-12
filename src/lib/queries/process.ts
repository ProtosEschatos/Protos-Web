import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/database.types'

export type ProcessStepRow = Tables<'process_steps'>

/**
 * Not every locale (currently `sr`) has its own rows yet, so we fall back to
 * the Croatian content rather than showing an empty section.
 */
export async function getProcessSteps(language = 'hr'): Promise<ProcessStepRow[]> {
  if (!supabase) return []

  const fetchByLanguage = async (lang: string) => {
    const { data, error } = await supabase!
      .from('process_steps')
      .select('*')
      .eq('active', true)
      .eq('language', lang)
      .order('step_number', { ascending: true })

    if (error) {
      console.error('getProcessSteps error:', error)
      return []
    }
    return data ?? []
  }

  const rows = await fetchByLanguage(language)
  if (rows.length > 0 || language === 'hr') return rows

  return fetchByLanguage('hr')
}
