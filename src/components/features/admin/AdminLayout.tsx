'use client'

import type { ReactNode } from 'react'
import AdminSidebar from '@/components/features/admin/AdminSidebar'

type Props = {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:flex-row lg:p-8">
      <AdminSidebar />
      <main id="dashboard-content" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}
