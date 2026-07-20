import { setRequestLocale } from 'next-intl/server'
import { KeyRound } from 'lucide-react'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import ApiKeysManager from '@/components/features/admin/ApiKeysManager'
import { adminListApiKeys } from '@/actions/admin-api-keys'
import { isCryptoConfigured } from '@/lib/security/api-keys-crypto'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminKeysPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const configured = isCryptoConfigured()
  const listResult = configured ? await adminListApiKeys() : null
  const initialKeys = listResult?.success ? listResult.data : []
  const loadError = listResult && !listResult.success ? listResult.error : null

  return (
    <AdminPageShell
      title="API ključevi"
      description="Enkriptirano skladište runtime ključeva (AES-256-GCM). Koriste ih server actions i Configurator za spajanje na vanjske servise."
    >
      {!configured ? (
        <div className="admin-card flex items-start gap-3 p-5 text-sm text-amber-300">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-2">
            <p className="font-medium text-slate-100">
              <code className="text-amber-300">ADMIN_KEYS_ENCRYPTION_KEY</code> nije postavljen.
            </p>
            <p className="text-slate-400">
              Generiraj ga jednom i dodaj u Vercel (Production, Preview, Development):
            </p>
            <pre className="admin-mono rounded-md border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-emerald-300">
{`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`}
            </pre>
            <p className="text-slate-500">
              Bez tog ključa spremljene vrijednosti se ne mogu ni šifrirati ni čitati.
            </p>
          </div>
        </div>
      ) : (
        <ApiKeysManager initialKeys={initialKeys} loadError={loadError} />
      )}
    </AdminPageShell>
  )
}
