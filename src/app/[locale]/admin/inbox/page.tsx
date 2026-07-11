import { setRequestLocale } from 'next-intl/server'
import { adminListContacts } from '@/actions/admin-notifications'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminLink from '@/components/admin/AdminLink'
import { ADMIN_COMMS_SERVICES } from '@/lib/admin-services'
import { CONTACT_EMAIL } from '@/lib/site'

type Props = { params: { locale: string } }

export default async function AdminInboxPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const contacts = await adminListContacts(50)

  return (
    <AdminPageShell
      title="Kontakt upiti"
      description={`${ADMIN_COMMS_SERVICES.webInbox.role} Email obavijest ide na ${CONTACT_EMAIL}.`}
    >
      <p className="text-sm text-[var(--light-muted)] mb-6">
        Zoho inbox:{' '}
        <a
          href={ADMIN_COMMS_SERVICES.zoho.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        {' · '}
        <AdminLink href="/admin" className="text-[var(--primary)] hover:underline">
          ← natrag na pregled
        </AdminLink>
      </p>

      <h2 className="text-lg font-semibold text-[var(--light)] mb-4">Upiti s web stranice</h2>
      <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
        {contacts.length === 0 ? (
          <p className="px-4 py-8 text-center text-[var(--light-muted)]">Nema upita.</p>
        ) : (
          contacts.map((c) => (
            <article key={c.id} className="px-4 py-4">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-[var(--light)]">{c.name}</p>
                  <a href={`mailto:${c.email}`} className="text-sm text-[var(--primary)] hover:underline">
                    {c.email}
                  </a>
                </div>
                <p className="text-xs text-[var(--light-muted)]">
                  {c.created_at ? new Date(c.created_at).toLocaleString('hr-HR') : ''}
                </p>
              </div>
              {c.service ? <p className="text-xs text-[var(--light-muted)] mb-1">Usluga: {c.service}</p> : null}
              <p className="text-sm text-[var(--light-muted)] whitespace-pre-wrap">{c.message}</p>
            </article>
          ))
        )}
      </div>
    </AdminPageShell>
  )
}
