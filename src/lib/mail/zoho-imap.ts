import 'server-only'

/** Backward-compatible wrappers around the multi-mailbox IMAP client. */
export type { MailListItem, MailMessage } from '@/lib/mail/types'
export { fetchMailboxInbox, fetchMailboxMessage } from '@/lib/mail/imap-client'
import { fetchMailboxInbox, fetchMailboxMessage } from '@/lib/mail/imap-client'
import { isMailboxConfigured } from '@/lib/mail/mailboxes'

export function isZohoImapConfigured(): boolean {
  return isMailboxConfigured('zoho')
}

export async function fetchZohoInbox(limit = 30) {
  return fetchMailboxInbox('zoho', limit)
}

export async function fetchZohoMail(uid: number) {
  return fetchMailboxMessage('zoho', uid)
}
