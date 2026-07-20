import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type PublishLogRow = {
  id: string
  platform: string
  kind: string
  status: string
  title: string | null
  bodyPreview: string | null
  remoteUrl: string | null
  errorMessage: string | null
  createdAt: string
}

export async function listPublishLog(limit = 30): Promise<PublishLogRow[]> {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('published_posts')
    .select('id, platform, kind, status, title, body_preview, remote_url, error_message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []).map((row) => ({
    id: row.id,
    platform: row.platform,
    kind: row.kind,
    status: row.status,
    title: row.title,
    bodyPreview: row.body_preview,
    remoteUrl: row.remote_url,
    errorMessage: row.error_message,
    createdAt: row.created_at,
  }))
}
