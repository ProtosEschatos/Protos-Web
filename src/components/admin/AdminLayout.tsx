'use client'

import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

type Props = {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
