import { CONTACT_EMAIL } from '@/lib/config/site'

/** Zoho mailbox for Martina — set MARTINA_IMAP_* when the account is live. */
export const MARTINA_CONTACT_EMAIL = 'martina.admin@protosweb.eu'

export type MailboxId = 'zoho' | 'martina'

export type MailboxProvider = 'zoho'

export type MailboxDefinition = {
  id: MailboxId
  title: string
  email: string
  defaultHost: string
  defaultPort: number
  provider: MailboxProvider
  env: {
    user: string
    password: string
    host: string
    port: string
  }
}

export const ADMIN_MAILBOXES: MailboxDefinition[] = [
  {
    id: 'zoho',
    title: 'Protos Web (Zoho)',
    email: CONTACT_EMAIL,
    defaultHost: 'imappro.zoho.eu',
    defaultPort: 993,
    provider: 'zoho',
    env: {
      user: 'ZOHO_IMAP_USER',
      password: 'ZOHO_IMAP_PASSWORD',
      host: 'ZOHO_IMAP_HOST',
      port: 'ZOHO_IMAP_PORT',
    },
  },
  {
    id: 'martina',
    title: 'Martina (Zoho)',
    email: MARTINA_CONTACT_EMAIL,
    defaultHost: 'imappro.zoho.eu',
    defaultPort: 993,
    provider: 'zoho',
    env: {
      user: 'MARTINA_IMAP_USER',
      password: 'MARTINA_IMAP_PASSWORD',
      host: 'MARTINA_IMAP_HOST',
      port: 'MARTINA_IMAP_PORT',
    },
  },
]

export function getMailbox(id: MailboxId): MailboxDefinition {
  const mailbox = ADMIN_MAILBOXES.find((item) => item.id === id)
  if (!mailbox) throw new Error(`Unknown mailbox: ${id}`)
  return mailbox
}

export function isMailboxConfigured(id: MailboxId): boolean {
  const { env } = getMailbox(id)
  return Boolean(process.env[env.password]?.trim())
}

export function resolveMailboxImapConfig(id: MailboxId) {
  const def = getMailbox(id)
  const password = process.env[def.env.password]?.trim()
  if (!password) return null

  return {
    host: process.env[def.env.host]?.trim() || def.defaultHost,
    port: Number(process.env[def.env.port] || def.defaultPort),
    secure: true,
    auth: {
      user: process.env[def.env.user]?.trim() || def.email,
      pass: password,
    },
    logger: false as const,
  }
}

export function mailboxSetupHint(id: MailboxId): string {
  const def = getMailbox(id)
  return `Postavi na Vercelu: ${def.env.password} (Zoho lozinka ili app password). U Zohu uključi IMAP Access za ${def.email}. Host: ${def.defaultHost}:${def.defaultPort}`
}
