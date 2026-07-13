import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import PortfolioAdminForm from '@/components/features/admin/PortfolioAdminForm'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminPortfolioNewPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  return (
    <AdminPageShell title="Novi projekt" backHref="/admin/portfolio" backLabel="Portfolio">
      <PortfolioAdminForm />
    </AdminPageShell>
  )
}
