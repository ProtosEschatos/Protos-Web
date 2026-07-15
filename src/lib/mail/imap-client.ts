import { ImapFlow } from 'imapflow'
import {
  getMailbox,
  isMailboxConfigured,
  resolveMailboxImapConfig,
  type MailboxId,
} from '@/lib/mail/mailboxes'

export type MailListItem = {
  uid: number
  subject: string
  from: string
  to: string
  date: string | null
  seen: boolean
  preview: string
}

export type MailMessage = MailListItem & {
  text: string
  html: string | null
}

function formatAddress(addr: { name?: string; address?: string } | undefined): string {
  if (!addr) return ''
  if (addr.name && addr.address) return `${addr.name} <${addr.address}>`
  return addr.address ?? addr.name ?? ''
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function withImapClient<T>(mailboxId: MailboxId, fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const config = resolveMailboxImapConfig(mailboxId)
  if (!config) {
    throw new Error(`${getMailbox(mailboxId).env.password} nije postavljen na Vercelu`)
  }

  const client = new ImapFlow(config)
  await client.connect()
  try {
    return await fn(client)
  } finally {
    try {
      await client.logout()
    } catch {
      // ignore logout errors
    }
  }
}

export { isMailboxConfigured }

export async function fetchMailboxInbox(
  mailboxId: MailboxId,
  limit = 30,
): Promise<{
  messages: MailListItem[]
  error?: string
}> {
  if (!isMailboxConfigured(mailboxId)) {
    const { env, email } = getMailbox(mailboxId)
    return {
      messages: [],
      error: `${env.password} nije postavljen na Vercelu (${email})`,
    }
  }

  try {
    return await withImapClient(mailboxId, async (client) => {
      const lock = await client.getMailboxLock('INBOX')
      try {
        const uids = await client.search({ all: true }, { uid: true })
        if (!uids || uids.length === 0) return { messages: [] }

        const recent = uids.slice(-limit).reverse()
        const messages: MailListItem[] = []

        for await (const msg of client.fetch(recent, {
          uid: true,
          envelope: true,
          flags: true,
          bodyStructure: true,
        })) {
          const subject = msg.envelope?.subject ?? '(bez naslova)'
          const from = formatAddress(msg.envelope?.from?.[0])
          const to = formatAddress(msg.envelope?.to?.[0])
          const date = msg.envelope?.date ? msg.envelope.date.toISOString() : null
          const seen = msg.flags?.has('\\Seen') ?? false

          messages.push({
            uid: msg.uid,
            subject,
            from,
            to,
            date,
            seen,
            preview: '',
          })
        }

        return { messages }
      } finally {
        lock.release()
      }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'IMAP greška'
    console.error(`fetchMailboxInbox(${mailboxId}):`, message)
    return { messages: [], error: message }
  }
}

export async function fetchMailboxMessage(
  mailboxId: MailboxId,
  uid: number,
): Promise<{
  message: MailMessage | null
  error?: string
}> {
  if (!isMailboxConfigured(mailboxId)) {
    const { env } = getMailbox(mailboxId)
    return { message: null, error: `${env.password} nije postavljen na Vercelu` }
  }

  try {
    return await withImapClient(mailboxId, async (client) => {
      const lock = await client.getMailboxLock('INBOX')
      try {
        let result: MailMessage | null = null

        for await (const msg of client.fetch(
          { uid },
          { uid: true, envelope: true, flags: true, source: true },
          { uid: true },
        )) {
          const raw = msg.source?.toString('utf8') ?? ''
          const textMatch = raw.match(/Content-Type: text\/plain[\s\S]*?\n\n([\s\S]*?)(?=\n--|\nContent-Type:|$)/i)
          const htmlMatch = raw.match(/Content-Type: text\/html[\s\S]*?\n\n([\s\S]*?)(?=\n--|\nContent-Type:|$)/i)
          const text = textMatch?.[1]?.trim() ?? stripHtml(htmlMatch?.[1] ?? '') ?? raw.slice(0, 4000)
          const html = htmlMatch?.[1]?.trim() ?? null

          result = {
            uid: msg.uid,
            subject: msg.envelope?.subject ?? '(bez naslova)',
            from: formatAddress(msg.envelope?.from?.[0]),
            to: formatAddress(msg.envelope?.to?.[0]),
            date: msg.envelope?.date ? msg.envelope.date.toISOString() : null,
            seen: msg.flags?.has('\\Seen') ?? false,
            preview: text.slice(0, 200),
            text,
            html,
          }
        }

        return { message: result }
      } finally {
        lock.release()
      }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'IMAP greška'
    return { message: null, error: message }
  }
}
