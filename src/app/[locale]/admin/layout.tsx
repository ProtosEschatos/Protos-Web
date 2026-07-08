import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
