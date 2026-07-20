import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AutomationsManager from '@/components/features/admin/AutomationsManager'
import { adminListAutomations } from '@/actions/admin-automations'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminAutomationsPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const result = await adminListAutomations()
  const initial = result.success ? result.data : []
  const loadError = result.success ? null : result.error

  return (
    <AdminPageShell
      title="Automatizacije"
      description="Outbound webhookovi (Zapier / n8n / Make / Slack / bilo koji HTTP endpoint). Ručno okidanje ili automatski na eventove aplikacije."
    >
      <AutomationsManager initial={initial} loadError={loadError} />
    </AdminPageShell>
  )
}
