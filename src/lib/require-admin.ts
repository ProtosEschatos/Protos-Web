import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth'

export async function requireAdmin(): Promise<void> {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    throw new Error('Unauthorized')
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value
  return verifyAdminSession(token)
}
