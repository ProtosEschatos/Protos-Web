'use client'

import AdminBackground from '@/components/features/admin/AdminBackground'
import AdminHeader from '@/components/features/admin/AdminHeader'
import AdminLayout from '@/components/features/admin/AdminLayout'
import '@/styles/admin-console.css'

type Props = {
  children: React.ReactNode
  variant: 'login' | 'dashboard'
}

export default function AdminShell({ children, variant }: Props) {
  if (variant === 'login') {
    return (
      <div className="admin-console relative min-h-screen">
        <AdminBackground />
        <div className="relative z-[1]">{children}</div>
      </div>
    )
  }

  return (
    <div id="admin-main-container" className="admin-console relative flex min-h-screen flex-col">
      <AdminBackground />
      <AdminHeader />
      <AdminLayout>{children}</AdminLayout>
      <footer className="relative z-[1] mt-auto border-t border-slate-900 py-6 px-8 text-center text-[11px] text-slate-500 admin-mono">
        <p className="mx-auto max-w-xl leading-relaxed">
          Protos Web Console — Next.js · Supabase · Vercel. Admin pristup zahtijeva{' '}
          <code className="text-indigo-400/90">ADMIN_SECRET</code> na Vercelu.
        </p>
      </footer>
    </div>
  )
}
