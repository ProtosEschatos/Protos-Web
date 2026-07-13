import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-auth'

export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    throw new Error('Unauthorized')
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  return verifyAdminSession(token)
}
