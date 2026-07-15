'use server'

import { supabase } from '@/lib/supabase'

export async function submitContact(data: {
  name: string
  email: string
  service: string
  message: string
  language?: string
}) {
  if (!supabase) {
    console.error('Contact submission failed: Supabase not configured')
    return { success: false, error: 'Contact form is not configured' }
  }

  const { error } = await supabase.rpc('submit_contact', {
    p_name: data.name,
    p_email: data.email,
    p_phone: null,
    p_service: data.service || null,
    p_message: data.message,
    p_language: data.language || 'hr',
    p_ip: null,
  })

  if (error) {
    console.error('submit_contact error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
