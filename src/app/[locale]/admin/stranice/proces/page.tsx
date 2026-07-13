import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminStaticPagePanel from '@/components/features/admin/AdminStaticPagePanel'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminProcessPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

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
          { label: 'Process sekcija (home)', path: 'src/components/features/home/sections/Process.tsx' },
          { label: 'Prijevodi (hr)', path: 'src/messages/hr.json → processPage' },
          { label: 'Javna ruta', path: 'src/app/[locale]/proces/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
