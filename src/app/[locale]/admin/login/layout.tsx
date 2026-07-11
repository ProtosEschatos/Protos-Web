import AdminShell from '@/components/admin/AdminShell'

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell variant="login">{children}</AdminShell>
}
