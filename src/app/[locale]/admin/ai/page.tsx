import { setRequestLocale } from 'next-intl/server'
import AdminAiPanel from '@/components/admin/AdminAiPanel'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { getAiProviderStatus } from '@/lib/ai/providers'
import { CheckCircle2, XCircle } from 'lucide-react'

type Props = { params: { locale: string } }

function ProviderPill({ label, ready }: { label: string; ready: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        ready
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      }`}
    >
      {ready ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  )
}

export default async function AdminAiPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const status = getAiProviderStatus()

  return (
    <AdminPageShell
      title="AI asistent"
      description="DeepSeek (i opcionalno Gemini) za sadržaj, planove i pomoć — ključevi samo na Vercelu."
      actions={
        <div className="flex flex-wrap gap-2">
          <ProviderPill label="DeepSeek" ready={status.deepseek} />
          <ProviderPill label="Gemini" ready={status.gemini} />
        </div>
      }
    >
      <AdminAiPanel deepseekReady={status.deepseek} geminiReady={status.gemini} />
    </AdminPageShell>
  )
}
