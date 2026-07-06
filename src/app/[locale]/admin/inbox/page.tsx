import { setRequestLocale } from 'next-intl/server'
import { adminListContacts } from '@/actions/admin-notifications'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminHubCard from '@/components/admin/AdminHubCard'
import { CONTACT_EMAIL } from '@/lib/site'
import { Inbox } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminInboxPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const contacts = await adminListContacts(50)

  return (
    <AdminPageShell
      title="Inbox"
      description={`Zoho inbox (${CONTACT_EMAIL}) + upiti s kontakt forme u bazi.`}
    >
      <div className="mb-8 max-w-md">
        <AdminHubCard
          href="https://mail.zoho.eu"
          label="Otvori Zoho Mail"
          description={CONTACT_EMAIL}
          icon={Inbox}
          external
        />
      </div>

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
