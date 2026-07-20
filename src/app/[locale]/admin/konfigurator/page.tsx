import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import ConfiguratorManager from '@/components/features/admin/ConfiguratorManager'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminConfiguratorPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <AdminPageShell
      title="3D Konfigurator"
      description="Live scena za kreiranje elemenata za protosweb.eu. Podržava primitive, .glb/.gltf URL-ove i Sketchfab pretragu (spojeno na API ključeve vault)."
    >
      <ConfiguratorManager />
    </AdminPageShell>
  )
}
