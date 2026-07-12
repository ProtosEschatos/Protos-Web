import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminSession, ADMIN_COOKIE } from '@/lib/auth/admin-auth'
import { adminGetActivityBadgeCount } from '@/actions/admin-notifications'

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const count = await adminGetActivityBadgeCount()
  return NextResponse.json({ count })
}
