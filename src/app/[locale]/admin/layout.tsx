import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin | Protos Web',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
