import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminSection from '@/components/admin/AdminSection'
import AdminAiPanel from '@/components/admin/AdminAiPanel'
import { getIntegrationsOverview } from '@/lib/admin/integrations-status'
import AdminHubCard from '@/components/admin/AdminHubCard'
import { Plug } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminAiPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const overview = await getIntegrationsOverview()
  const deepseek = overview.services.find((s) => s.label === 'DeepSeek AI')
  const gemini = overview.services.find((s) => s.label === 'Google Gemini')

  return (
    <AdminPageShell
      title="AI asistent"
      description="DeepSeek i Gemini za generiranje blog/portfolio sadržaja. Ključevi samo u Vercel env varijablama."
    >
      <AdminSection title="Provider status">
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <AdminHubCard
            href="/admin/integrations"
            label="DeepSeek"
            description={deepseek?.configured ? 'Konfiguriran' : 'Dodaj DEEPSEEK_API_KEY'}
            icon={Plug}
            pending={!deepseek?.configured}
          />
          <AdminHubCard
            href="/admin/integrations"
            label="Gemini"
            description={gemini?.configured ? 'Konfiguriran' : 'Dodaj GEMINI_API_KEY'}
            icon={Plug}
            pending={!gemini?.configured}
          />
        </div>
      </AdminSection>

      <AdminSection title="Chat">
        <AdminAiPanel />
      </AdminSection>
    </AdminPageShell>
  )
}
