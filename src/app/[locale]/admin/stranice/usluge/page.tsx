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
        description="Lista usluga, ikone i CTA sada se dohvaćaju iz Supabase tablice `services` (po jeziku). Naslov sekcije, FAQ i CTA copy ostaju u prijevodima."
        publicHref="/usluge"
        sourceHint="Sadržaj kartica uređuje se u Supabase tablici `services`, ne u kodu ili JSON-u. Nema još CRUD ekrana ovdje — uređuje se direktno u bazi."
        sourcePaths={[
          { label: 'Supabase tablica', path: 'public.services (kolone: title, subtitle, icon, sort_order, language, active)' },
          { label: 'Query helper', path: 'src/lib/queries/services.ts' },
          { label: 'Grid komponenta', path: 'src/components/features/services/ServicesGrid.tsx' },
          { label: 'Naslov/FAQ/CTA copy (hr)', path: 'src/messages/hr.json → services' },
          { label: 'Javna ruta', path: 'src/app/[locale]/usluge/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
