import { setRequestLocale } from 'next-intl/server'
import { adminListContacts } from '@/actions/admin-notifications'
import { adminListMailbox, adminListMailboxStatuses } from '@/actions/admin-mail'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminLink from '@/components/features/admin/AdminLink'
import AdminMailboxPanel from '@/components/features/admin/AdminMailboxPanel'
import { ADMIN_MAILBOXES } from '@/lib/mail/mailboxes'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminInboxPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const [contacts, mailboxStatuses] = await Promise.all([
    adminListContacts(50),
    adminListMailboxStatuses(),
  ])

  // Only show Martina's mailbox once it's actually configured — otherwise
  // the inbox page shows "Zoho" twice (hers is also a Zoho account) for a
  // mailbox nobody uses yet. Reappears automatically once MARTINA_IMAP_* is set.
  const visibleMailboxes = ADMIN_MAILBOXES.filter((mailbox) => {
    if (mailbox.id === 'martina') {
      return mailboxStatuses.find((s) => s.id === 'martina')?.configured ?? false
    }
    return true
  })
  const mailboxResults = await Promise.all(
    visibleMailboxes.map((mailbox) => adminListMailbox(mailbox.id, 40)),
  )

  return (
    <AdminPageShell
      title="Inbox"
      description="Svi mail sandučići i kontakt upiti — sve na jednom mjestu u adminu."
    >
      <p className="text-sm text-[var(--light-muted)] mb-8">
        Zoho ({mailboxStatuses.find((m) => m.id === 'zoho')?.email}) i Gmail studio.
        Ako admin inbox ne učita live IMAP, prikazuje se zadnji cache iz Supabase.
        {' · '}
        <a
          href="https://mail.zoho.eu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:underline"
        >
          Otvori Zoho webmail
        </a>
        {' · '}
        <AdminLink href="/admin" className="text-[var(--primary)] hover:underline">
          ← pregled
        </AdminLink>
      </p>

      <div className="space-y-10 mb-10">
        {visibleMailboxes.map((definition, index) => {
          const status = mailboxStatuses.find((item) => item.id === definition.id)!
          const mailbox = mailboxResults[index]

          return (
            <section key={definition.id}>
              <h2 className="text-lg font-semibold text-[var(--light)] mb-4">{definition.title}</h2>
              <AdminMailboxPanel
                mailboxId={definition.id}
                title={definition.title}
                initialMessages={mailbox.messages}
                initialError={mailbox.error}
                initialSource={mailbox.source}
                initialSyncedAt={mailbox.syncedAt}
                configured={status.configured}
                mailbox={status.email}
                provider={definition.provider}
              />
            </section>
          )
        })}
      </div>

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
