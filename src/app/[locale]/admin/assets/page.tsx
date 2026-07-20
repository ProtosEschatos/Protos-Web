import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AssetsWorkspace from '@/components/features/admin/AssetsWorkspace'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminAssetsPage(props: Props) {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <AdminPageShell
      title="Assets"
      description="Centralna biblioteka slika, videa i 3D modela. Uploadi idu direktno u privatni bucket admin-uploads (Supabase Storage). Označene s LIVE → dostupne javnim stranicama kroz getPublishedAssets({ tag })."
    >
      <AssetsWorkspace />
    </AdminPageShell>
  )
}
