import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import PublishManager from '@/components/features/admin/PublishManager'
import { adminListApiKeys } from '@/actions/admin-api-keys'
import { listPublishLog } from '@/lib/queries/admin/publish-log'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminPublishPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [keys, log] = await Promise.all([adminListApiKeys(), listPublishLog(50)])
  const installedProviders = new Set<string>()
  if (keys.success) {
    for (const key of keys.data) {
      if (key.isActive) installedProviders.add(key.provider)
    }
  }

  return (
    <AdminPageShell
      title="Objavi (Publish)"
      description="Jedan klik → Bluesky, Mastodon, Threads, Facebook, Instagram (short) ili Ghost, Hashnode, Dev.to (long). Sve akcije se pišu u audit log i /admin/publish log."
    >
      <PublishManager installedProviders={installedProviders} recentLog={log} />
    </AdminPageShell>
  )
}
