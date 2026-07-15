import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  return NextResponse.json({ authenticated: verifyAdminSession(token) })
}
