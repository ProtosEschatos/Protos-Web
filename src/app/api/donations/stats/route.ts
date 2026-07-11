import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { buildDefaultStats, statsFromTotals } from '@/lib/donations'

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ stats: buildDefaultStats() })
  }

  const { data, error } = await supabaseAdmin.rpc('get_donation_totals')

  if (error) {
    console.error('get_donation_totals:', error.message)
    return NextResponse.json({ stats: buildDefaultStats() })
  }

  return NextResponse.json({ stats: statsFromTotals(data) })
}
