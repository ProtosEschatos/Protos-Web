'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import {
  fetchZohoInbox,
  fetchZohoMail,
  isZohoImapConfigured,
  type MailListItem,
  type MailMessage,
} from '@/lib/mail/zoho-imap'

export async function adminGetImapStatus(): Promise<{
  configured: boolean
  mailbox: string
}> {
  await requireAdmin()
  return {
    configured: isZohoImapConfigured(),
    mailbox: process.env.ZOHO_IMAP_USER?.trim() || 'dario.admin@protosweb.eu',
  }
}

export async function adminListMailbox(limit = 40): Promise<{
  messages: MailListItem[]
  error?: string
}> {
  await requireAdmin()
  return fetchZohoInbox(limit)
}

export async function adminGetMailMessage(uid: number): Promise<{
  message: MailMessage | null
  error?: string
}> {
  await requireAdmin()
  if (!Number.isFinite(uid) || uid <= 0) {
    return { message: null, error: 'Neispravan UID' }
  }
  return fetchZohoMail(uid)
}
