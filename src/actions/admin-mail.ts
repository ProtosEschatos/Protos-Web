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

export type AdminMailboxListResult = {
  messages: MailListItem[]
  error?: string
  source: 'live' | 'cache'
  syncedAt?: string
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

export async function adminListMailbox(
  mailboxId: MailboxId,
  limit = 40,
  options?: { preferCache?: boolean },
): Promise<AdminMailboxListResult> {
  await requireAdmin()

  if (options?.preferCache) {
    const cached = await getCachedMailboxInbox(mailboxId, limit)
    if (cached.messages.length > 0 || cached.syncedAt) {
      return {
        messages: cached.messages,
        error: cached.error,
        source: 'cache',
        syncedAt: cached.syncedAt,
      }
    }
  }

  if (!isMailboxConfigured(mailboxId)) {
    const cached = await getCachedMailboxInbox(mailboxId, limit)
    if (cached.messages.length > 0) {
      return {
        messages: cached.messages,
        error: cached.error ?? `${getMailbox(mailboxId).env.password} nije postavljen na Vercelu`,
        source: 'cache',
        syncedAt: cached.syncedAt,
      }
    }
    const live = await fetchMailboxInbox(mailboxId, limit)
    return { ...live, source: 'live' }
  }

  const live = await fetchMailboxInbox(mailboxId, limit)
  if (live.messages.length > 0 && !live.error) {
    await syncMailboxToCache(mailboxId)
    return { ...live, source: 'live' }
  }

  const cached = await getCachedMailboxInbox(mailboxId, limit)
  if (cached.messages.length > 0) {
    return {
      messages: cached.messages,
      error: live.error
        ? `${live.error} — prikazan zadnji cache (${cached.syncedAt ? new Date(cached.syncedAt).toLocaleString('hr-HR') : 'nepoznato'})`
        : cached.error,
      source: 'cache',
      syncedAt: cached.syncedAt,
    }
  }

  return { ...live, source: 'live' }
}

/** Force live IMAP fetch and refresh Supabase cache (Refresh button). */
export async function adminRefreshMailbox(
  mailboxId: MailboxId,
  limit = 40,
): Promise<AdminMailboxListResult> {
  await requireAdmin()
  await syncMailboxToCache(mailboxId)
  const cached = await getCachedMailboxInbox(mailboxId, limit)
  return {
    messages: cached.messages,
    error: cached.error,
    source: cached.messages.length > 0 || cached.syncedAt ? 'cache' : 'live',
    syncedAt: cached.syncedAt,
  }
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
