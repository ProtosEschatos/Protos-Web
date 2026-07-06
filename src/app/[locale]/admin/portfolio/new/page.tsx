import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/admin/AdminPageShell'
import PortfolioAdminForm from '@/components/admin/PortfolioAdminForm'

type Props = { params: { locale: string } }

export default function AdminPortfolioNewPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return (
    <AdminPageShell title="Novi projekt" backHref="/admin/portfolio" backLabel="Portfolio">
      <PortfolioAdminForm />
    </AdminPageShell>
  )
}
