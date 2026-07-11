'use client'

import AdminBackground from '@/components/admin/AdminBackground'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminLayout from '@/components/admin/AdminLayout'

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
