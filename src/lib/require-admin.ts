import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth'

export async function requireAdmin(): Promise<void> {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    redirect('/admin/login')
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value
  return verifyAdminSession(token)
}
