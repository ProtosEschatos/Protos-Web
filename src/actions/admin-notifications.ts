'use server'

import { requireAdmin } from '@/lib/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminStatus } from '@/actions/admin-status'
import { mergeActivity, type AdminActivityItem } from '@/lib/admin-activity'

export type SiteContact = {
  id: string
  name: string
  email: string
  message: string | null
  service: string | null
  created_at: string | null
}

export type SiteSubscriber = {
  id: string
  email: string
  language: string | null
  source: string | null
  created_at: string | null
}

export type AdminNotifications = {
  recentContacts: SiteContact[]
  recentSubscribers: SiteSubscriber[]
  activityFeed: AdminActivityItem[]
  contactsLast7Days: number
  contactsLast24Hours: number
  subscribersLast7Days: number
  subscribersLast24Hours: number
  recentActivityCount: number
  subscriberCount: number
  dnsIssues: number
  serviceRoleConfigured: boolean
}

function dayAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export async function adminGetActivityBadgeCount(): Promise<number> {
  await requireAdmin()
  if (!supabaseAdmin) return 0

  const since = dayAgoIso(1)

  const [{ count: contacts }, { count: subs }] = await Promise.all([
    supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabaseAdmin.from('subscribers').select('id', { count: 'exact', head: true }).gte('created_at', since),
  ])

  return (contacts ?? 0) + (subs ?? 0)
}

export async function adminGetNotifications(): Promise<AdminNotifications> {
  await requireAdmin()

  const status = await getAdminStatus()
  const dnsIssues = status.dns.filter((d) => !d.ok).length

  let recentContacts: SiteContact[] = []
  let recentSubscribers: SiteSubscriber[] = []
  let contactsLast7Days = 0
  let contactsLast24Hours = 0
  let subscribersLast7Days = 0
  let subscribersLast24Hours = 0
  let subscriberCount = 0

  if (supabaseAdmin) {
    const weekAgo = dayAgoIso(7)
    const dayAgo = dayAgoIso(1)

    const [contactsRes, subsRes, weekContacts, dayContacts, weekSubs, daySubs, totalSubs] =
      await Promise.all([
        supabaseAdmin
          .from('contacts')
          .select('id, name, email, message, service, created_at')
          .order('created_at', { ascending: false })
          .limit(12),
        supabaseAdmin
          .from('subscribers')
          .select('id, email, language, source, created_at')
          .order('created_at', { ascending: false })
          .limit(12),
        supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
        supabaseAdmin.from('subscribers').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabaseAdmin.from('subscribers').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
        supabaseAdmin.from('subscribers').select('id', { count: 'exact', head: true }),
      ])

    recentContacts = contactsRes.data ?? []
    recentSubscribers = subsRes.data ?? []
    contactsLast7Days = weekContacts.count ?? 0
    contactsLast24Hours = dayContacts.count ?? 0
    subscribersLast7Days = weekSubs.count ?? 0
    subscribersLast24Hours = daySubs.count ?? 0
    subscriberCount = totalSubs.count ?? 0
  }

  const activityFeed = mergeActivity(recentContacts, recentSubscribers, 15)

  return {
    recentContacts,
    recentSubscribers,
    activityFeed,
    contactsLast7Days,
    contactsLast24Hours,
    subscribersLast7Days,
    subscribersLast24Hours,
    recentActivityCount: contactsLast24Hours + subscribersLast24Hours,
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

export async function adminListSubscribers(limit = 50): Promise<SiteSubscriber[]> {
  await requireAdmin()
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('id, email, language, source, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('adminListSubscribers:', error)
    return []
  }
  return data ?? []
}
