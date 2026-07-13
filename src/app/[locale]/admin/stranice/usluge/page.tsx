import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminStaticPagePanel from '@/components/features/admin/AdminStaticPagePanel'

type Props = { params: { locale: string } }

export default async function AdminServicesPage({ params: { locale } }: Props) {
  setRequestLocale(locale)

  return (
    <AdminPageShell
      title="Usluge"
      description="Ponuda, paketi i opisi usluga — usklađeno s /usluge na javnoj stranici."
      backHref="/admin"
    >
      <AdminStaticPagePanel
        title="Stranica Usluge"
        description="Lista usluga, cijene i CTA. Za dinamički sadržaj koristi blog ili portfolio; ovdje je statički marketing copy."
        publicHref="/usluge"
        sourceHint="Uredi usluge u services sekciji ili messages datotekama."
        sourcePaths={[
          { label: 'Services sekcija (home)', path: 'src/components/features/home/sections/Services.tsx' },
          { label: 'Prijevodi (hr)', path: 'src/messages/hr.json → services' },
          { label: 'Javna ruta', path: 'src/app/[locale]/usluge/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
