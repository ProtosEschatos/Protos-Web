import { setRequestLocale } from 'next-intl/server'
import AdminAiPanel from '@/components/admin/AdminAiPanel'
import AdminHubCard from '@/components/admin/AdminHubCard'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminSection from '@/components/admin/AdminSection'
import { getAiProviderStatus } from '@/lib/ai/providers'
import { Bot, Sparkles } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminAiPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const status = getAiProviderStatus()

  return (
    <AdminPageShell
      title="AI asistent"
      description="DeepSeek (i opcionalno Gemini) za sadržaj, planove i pomoć — ključevi samo na Vercelu."
    >
      <AdminSection title="Provider status">
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <AdminHubCard
            href="/admin/ai"
            label="DeepSeek"
            description={status.deepseek ? 'Konfiguriran na Vercelu' : 'Dodaj DEEPSEEK_API_KEY'}
            icon={Bot}
            pending={!status.deepseek}
          />
          <AdminHubCard
            href="/admin/ai"
            label="Gemini"
            description={status.gemini ? 'Konfiguriran na Vercelu' : 'Opcionalno — GEMINI_API_KEY'}
            icon={Sparkles}
            pending={!status.gemini}
          />
        </div>
      </AdminSection>

      <AdminSection title="Chat">
        <AdminAiPanel deepseekReady={status.deepseek} geminiReady={status.gemini} />
      </AdminSection>
    </AdminPageShell>
  )
}
