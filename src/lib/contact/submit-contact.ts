import { supabase } from '@/lib/supabase'

export type ContactSubmission = {
  name: string
  email: string
  service: string
  message: string
  language?: string
}

/** Persist contact form via Supabase RPC; email is sent by edge `submit-form` (DB webhook). */
export async function submitContact(
  data: ContactSubmission,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!supabase) {
    console.error('Contact submission failed: Supabase not configured')
    return { success: false, error: 'Contact form is not configured' }
  }

  const { error } = await supabase.rpc('submit_contact', {
    p_name: data.name,
    p_email: data.email,
    p_phone: '',
    p_service: data.service ?? '',
    p_message: data.message,
    p_language: data.language ?? 'hr',
    p_ip: '',
  })

  if (error) {
    console.error('submit_contact error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
