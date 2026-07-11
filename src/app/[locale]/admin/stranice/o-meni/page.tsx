import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminStaticPagePanel from '@/components/features/admin/AdminStaticPagePanel'

type Props = { params: { locale: string } }

export default async function AdminAboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale)

  return (
    <AdminPageShell
      title="O nama"
      description="Upravljanje sadržajem stranice O nama — usklađeno s javnim navbarom."
      backHref="/admin"
    >
      <AdminStaticPagePanel
        title="Stranica O nama"
        description="Tim (Dario & Martina), misija i hero tekst. CMS za statičke sekcije još nije odvojen — sadržaj je u React komponentama i i18n datotekama."
        publicHref="/o-meni"
        sourceHint="Za izmjene teksta koristi messages/*.json ili komponente u src/components/sections/about/."
        sourcePaths={[
          { label: 'About sekcija', path: 'src/components/sections/about/' },
          { label: 'Prijevodi (hr)', path: 'messages/hr.json → about' },
          { label: 'Javna ruta', path: 'src/app/[locale]/o-meni/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
