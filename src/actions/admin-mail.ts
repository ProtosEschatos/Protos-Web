'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import { fetchMailboxInbox, fetchMailboxMessage, type MailListItem, type MailMessage } from '@/lib/mail/imap-client'
import { getCachedMailboxInbox, syncMailboxToCache } from '@/lib/mail/inbox-sync'
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
  options?: { live?: boolean },
): Promise<{
  messages: MailListItem[]
  error?: string
  syncedAt?: string
}> {
  await requireAdmin()

  if (options?.live) {
    const live = await fetchMailboxInbox(mailboxId, limit)
    await syncMailboxToCache(mailboxId)
    return live
  }

  const cached = await getCachedMailboxInbox(mailboxId, limit)
  if (cached.messages.length > 0 || cached.syncedAt) {
    return cached
  }

  const live = await fetchMailboxInbox(mailboxId, limit)
  if (live.messages.length > 0 || !live.error) {
    await syncMailboxToCache(mailboxId)
  }
  return live
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
