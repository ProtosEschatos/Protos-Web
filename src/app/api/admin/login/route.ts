import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  getAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ success: false, message: 'Admin not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const password = typeof body.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, getAdminSessionToken(), adminCookieOptions)
    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
  }
}
