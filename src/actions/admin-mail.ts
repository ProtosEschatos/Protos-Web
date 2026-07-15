'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import { fetchMailboxInbox, fetchMailboxMessage, type MailListItem, type MailMessage } from '@/lib/mail/imap-client'
import {
  ADMIN_MAILBOXES,
  getMailbox,
  isMailboxConfigured,
  type MailboxId,
} from '@/lib/mail/mailboxes'

export type AdminMailboxStatus = {
  id: MailboxId
  title: string
  email: string
  configured: boolean
}

export async function adminListMailboxStatuses(): Promise<AdminMailboxStatus[]> {
  await requireAdmin()
  return ADMIN_MAILBOXES.map((mailbox) => ({
    id: mailbox.id,
    title: mailbox.title,
    email: process.env[mailbox.env.user]?.trim() || mailbox.email,
    configured: isMailboxConfigured(mailbox.id),
  }))
}

/** @deprecated Use adminListMailboxStatuses */
export async function adminGetImapStatus(): Promise<{
  configured: boolean
  mailbox: string
}> {
  await requireAdmin()
  const zoho = getMailbox('zoho')
  return {
    configured: isMailboxConfigured('zoho'),
    mailbox: process.env[zoho.env.user]?.trim() || zoho.email,
  }
}

export async function adminListMailbox(
  mailboxId: MailboxId,
  limit = 40,
): Promise<{
  messages: MailListItem[]
  error?: string
}> {
  await requireAdmin()
  return fetchMailboxInbox(mailboxId, limit)
}

export async function adminGetMailMessage(
  mailboxId: MailboxId,
  uid: number,
): Promise<{
  message: MailMessage | null
  error?: string
}> {
  await requireAdmin()
  if (!Number.isFinite(uid) || uid <= 0) {
    return { message: null, error: 'Neispravan UID' }
  }
  return fetchMailboxMessage(mailboxId, uid)
}
