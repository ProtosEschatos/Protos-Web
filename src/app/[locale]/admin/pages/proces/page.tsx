import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminStaticPagePanel from '@/components/admin/AdminStaticPagePanel'

type Props = { params: { locale: string } }

export default async function AdminProcessPage({ params: { locale } }: Props) {
  setRequestLocale(locale)

  return (
    <AdminPageShell
      title="Proces"
      description="Koraci suradnje i timeline — ista pozicija kao u javnom navbaru."
      backHref="/admin"
    >
      <AdminStaticPagePanel
        title="Stranica Proces"
        description="Prikaz koraka od prvog kontakta do isporuke. Sadržaj je statičan u komponentama; portfolio i blog imaju puni CMS."
        publicHref="/proces"
        sourceHint="Uredi korake i copy u process sekciji ili i18n ključevima."
        sourcePaths={[
          { label: 'Process sekcija', path: 'src/components/sections/process/' },
          { label: 'Prijevodi (hr)', path: 'messages/hr.json → process' },
          { label: 'Javna ruta', path: 'src/app/[locale]/proces/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
