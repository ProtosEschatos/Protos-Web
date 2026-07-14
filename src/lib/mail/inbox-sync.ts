import { supabaseAdmin } from '@/lib/supabase-admin'
import { fetchMailboxInbox, type MailListItem } from '@/lib/mail/imap-client'
import { ADMIN_MAILBOXES, isMailboxConfigured, type MailboxId } from '@/lib/mail/mailboxes'

export async function syncMailboxToCache(mailboxId: MailboxId): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { ok: false, error: 'Supabase admin not configured' }
  }

  if (!isMailboxConfigured(mailboxId)) {
    const { error } = await supabaseAdmin.from('admin_mail_sync').upsert({
      mailbox_id: mailboxId,
      messages: [],
      error: 'IMAP nije konfiguriran',
      synced_at: new Date().toISOString(),
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const result = await fetchMailboxInbox(mailboxId, 40)
  const { error } = await supabaseAdmin.from('admin_mail_sync').upsert({
    mailbox_id: mailboxId,
    messages: result.messages,
    error: result.error ?? null,
    synced_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function syncAllMailboxes(): Promise<Record<MailboxId, { ok: boolean; error?: string }>> {
  const results = {} as Record<MailboxId, { ok: boolean; error?: string }>

  for (const mailbox of ADMIN_MAILBOXES) {
    results[mailbox.id] = await syncMailboxToCache(mailbox.id)
  }

  return results
}

export async function getCachedMailboxInbox(
  mailboxId: MailboxId,
  limit = 40,
): Promise<{
  messages: MailListItem[]
  error?: string
  syncedAt?: string
}> {
  if (!supabaseAdmin) {
    return { messages: [], error: 'Supabase admin not configured' }
  }

  const { data, error } = await supabaseAdmin
    .from('admin_mail_sync')
    .select('messages, error, synced_at')
    .eq('mailbox_id', mailboxId)
    .maybeSingle()

  if (error) {
    return { messages: [], error: error.message }
  }

  if (!data) {
    return { messages: [], error: 'Cache prazan — čeka se prvi cron sync' }
  }

  const messages = Array.isArray(data.messages) ? (data.messages as MailListItem[]).slice(0, limit) : []

  return {
    messages,
    error: data.error ?? undefined,
    syncedAt: data.synced_at ?? undefined,
  }
}
