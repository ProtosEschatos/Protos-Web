'use client'

import AdminBackground from '@/components/features/admin/AdminBackground'
import AdminHeader from '@/components/features/admin/AdminHeader'
import AdminLayout from '@/components/features/admin/AdminLayout'

type Props = {
  children: React.ReactNode
  variant: 'login' | 'dashboard'
}

export default function AdminShell({ children, variant }: Props) {
  return (
    <div className="relative min-h-screen">
      <AdminBackground />
      {variant === 'dashboard' ? (
        <>
          <AdminHeader />
          <AdminLayout>{children}</AdminLayout>
        </>
      ) : (
        <div className="relative z-[1]">{children}</div>
      )}
    </div>
  )
}
