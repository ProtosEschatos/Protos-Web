import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

type Props = { params: { locale: string } }

export default function AdminLoginPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--dark)]" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
