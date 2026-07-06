'use server'

import { requireAdmin } from '@/lib/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminStatus } from '@/actions/admin-status'

export type SiteContact = {
  id: string
  name: string
  email: string
  message: string | null
  service: string | null
  created_at: string | null
}

export type AdminNotifications = {
  recentContacts: SiteContact[]
  contactsLast7Days: number
  subscriberCount: number
  dnsIssues: number
  serviceRoleConfigured: boolean
}

export async function adminGetNotifications(): Promise<AdminNotifications> {
  await requireAdmin()

  const status = await getAdminStatus()
  const dnsIssues = status.dns.filter((d) => !d.ok).length

  let recentContacts: SiteContact[] = []
  let contactsLast7Days = 0
  let subscriberCount = 0

  if (supabaseAdmin) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: contacts } = await supabaseAdmin
      .from('contacts')
      .select('id, name, email, message, service, created_at')
      .order('created_at', { ascending: false })
      .limit(8)

    recentContacts = contacts ?? []

    const { count: weekCount } = await supabaseAdmin
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    contactsLast7Days = weekCount ?? 0

    const { count: subs } = await supabaseAdmin
      .from('subscribers')
      .select('id', { count: 'exact', head: true })

    subscriberCount = subs ?? 0
  }

  return {
    recentContacts,
    contactsLast7Days,
    subscriberCount,
    dnsIssues,
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

export async function adminListContacts(limit = 50): Promise<SiteContact[]> {
  await requireAdmin()
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('id, name, email, message, service, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('adminListContacts:', error)
    return []
  }
  return data ?? []
}
