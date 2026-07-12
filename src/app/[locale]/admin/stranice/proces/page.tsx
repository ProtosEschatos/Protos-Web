import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminStaticPagePanel from '@/components/features/admin/AdminStaticPagePanel'

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
        description="Koraci (01-04) sada se dohvaćaju iz Supabase tablice `process_steps` (po jeziku). Feature kartice, stats i tehnologije ostaju u prijevodima."
        publicHref="/proces"
        sourceHint="Koraci se uređuju u Supabase tablici `process_steps`, ne u kodu ili JSON-u. Nema još CRUD ekrana ovdje — uređuje se direktno u bazi."
        sourcePaths={[
          { label: 'Supabase tablica', path: 'public.process_steps (kolone: title, description, icon, step_number, language, active)' },
          { label: 'Query helper', path: 'src/lib/queries/process.ts' },
          { label: 'Grid komponenta', path: 'src/components/features/process/ProcessStepsGrid.tsx' },
          { label: 'Features/stats copy (hr)', path: 'src/messages/hr.json → processPage' },
          { label: 'Javna ruta', path: 'src/app/[locale]/proces/page.tsx' },
        ]}
      />
    </AdminPageShell>
  )
}
