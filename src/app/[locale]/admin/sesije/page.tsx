import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminSessionsClient from '@/components/features/admin/AdminSessionsClient'
import { adminListSessions } from '@/actions/admin-sessions'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminSessionsPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const result = await adminListSessions()
  const sessions = result.success ? result.data : []

  return (
    <AdminPageShell
      title="Aktivne sesije"
      description="Svi opaque tokeni koji trenutno prolaze kroz proxy. Opozovi bilo koju sumnjivu, ili sve druge osim tvoje trenutne."
    >
      <AdminSessionsClient sessions={sessions} />
    </AdminPageShell>
  )
}
