import { requireAdmin } from '@/lib/auth/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DONATION_TARGETS, formatEuro, isDonationCause, statsFromTotals } from '@/lib/donations'

export type AdminDonationRow = {
  id: number
  amount: number
  cause: string | null
  email: string
  name: string | null
  status: string | null
  currency: string | null
  locale: string | null
  stripe_session_id: string | null
  created_at: string | null
}

export async function adminListDonations(limit = 100): Promise<AdminDonationRow[]> {
  await requireAdmin()
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('donations')
    .select(
      'id, amount, cause, email, name, status, currency, locale, stripe_session_id, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('adminListDonations:', error.message)
    return []
  }

  return (data ?? []) as AdminDonationRow[]
}

export async function adminGetDonationSummary() {
  await requireAdmin()
  if (!supabaseAdmin) {
    return { stats: statsFromTotals([]), totals: { completed: 0, pending: 0, allTime: 0 } }
  }

  const [{ data: rows }, { data: agg }] = await Promise.all([
    supabaseAdmin.rpc('get_donation_totals'),
    supabaseAdmin.from('donations').select('amount, status'),
  ])

  const stats = statsFromTotals(rows)
  let completed = 0
  let pending = 0
  let allTime = 0
  for (const row of agg ?? []) {
    const amt = Number(row.amount) || 0
    if (row.status === 'completed') {
      completed += amt
      allTime += amt
    } else if (row.status === 'pending') {
      pending += amt
    }
  }

  return {
    stats,
    totals: { completed, pending, allTime },
    targets: DONATION_TARGETS,
  }
}

export function causeLabel(cause: string | null): string {
  if (!cause || !isDonationCause(cause)) return cause ?? '—'
  const labels: Record<string, string> = {
    cyber: 'Cyber edukacija',
    education: 'Digitalna edukacija',
    platforms: 'Regionalne platforme',
  }
  return labels[cause]
}

export function statusBadge(status: string | null): string {
  switch (status) {
    case 'completed':
      return 'Uspješno'
    case 'pending':
      return 'Na čekanju'
    case 'expired':
      return 'Isteklo'
    case 'failed':
      return 'Neuspjelo'
    default:
      return status ?? '—'
  }
}

export { formatEuro }
