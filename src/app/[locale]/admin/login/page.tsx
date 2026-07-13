import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import AdminLoginForm from '@/components/features/admin/AdminLoginForm'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminLoginPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--dark)]" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
