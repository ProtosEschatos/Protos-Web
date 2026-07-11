import { setRequestLocale } from 'next-intl/server'
import { adminListContacts } from '@/actions/admin-notifications'
import { adminGetImapStatus, adminListMailbox } from '@/actions/admin-mail'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminLink from '@/components/features/admin/AdminLink'
import AdminMailboxPanel from '@/components/features/admin/AdminMailboxPanel'
import { CONTACT_EMAIL } from '@/lib/config/site'

type Props = { params: { locale: string } }

export default async function AdminInboxPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const [contacts, imapStatus, mailbox] = await Promise.all([
    adminListContacts(50),
    adminGetImapStatus(),
    adminListMailbox(40),
  ])

  return (
    <AdminPageShell
      title="Inbox"
      description={`Svi mailovi i kontakt upiti za ${CONTACT_EMAIL} — sve na jednom mjestu u adminu.`}
    >
      <p className="text-sm text-[var(--light-muted)] mb-8">
        Kontakt forma šalje obavijest na {CONTACT_EMAIL} i sprema upit u bazu ispod.
        {' · '}
        <AdminLink href="/admin" className="text-[var(--primary)] hover:underline">
          ← pregled
        </AdminLink>
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--light)] mb-4">Dolazni mail</h2>
        <AdminMailboxPanel
          initialMessages={mailbox.messages}
          initialError={mailbox.error}
          configured={imapStatus.configured}
          mailbox={imapStatus.mailbox}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--light)] mb-4">Kontakt forma (web)</h2>
        <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
          {contacts.length === 0 ? (
            <p className="px-4 py-8 text-center text-[var(--light-muted)]">Nema upita s web forme.</p>
          ) : (
            contacts.map((c) => (
              <article key={c.id} className="px-4 py-4">
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-[var(--light)]">{c.name}</p>
                    <p className="text-sm text-[var(--primary)]">{c.email}</p>
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
      </section>
    </AdminPageShell>
  )
}
