import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { adminGetPortfolioItem } from '@/lib/queries/admin/portfolio'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import PortfolioAdminForm from '@/components/features/admin/PortfolioAdminForm'

type Props = { params: { locale: string; id: string } }

export default async function AdminPortfolioEditPage({ params: { locale, id } }: Props) {
  setRequestLocale(locale)
  const item = await adminGetPortfolioItem(id)
  if (!item) notFound()

  return (
    <AdminPageShell title="Uredi projekt" backHref="/admin/portfolio" backLabel="Portfolio">
      <PortfolioAdminForm item={item} />
    </AdminPageShell>
  )
}
