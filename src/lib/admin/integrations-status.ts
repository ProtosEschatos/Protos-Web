import { getAdminStatus } from '@/lib/admin/status'

export type IntegrationStatus = {
  label: string
  configured: boolean
  detail: string
}

export type IntegrationsOverview = {
  services: IntegrationStatus[]
  supabase: {
    serviceRole: boolean
    designElementsCount: number | null
  }
}

export async function getIntegrationsOverview(): Promise<IntegrationsOverview> {
  const status = await getAdminStatus()
  let designElementsCount: number | null = null

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { supabaseAdmin } = await import('@/lib/supabase-admin')
      if (supabaseAdmin) {
        const { count } = await supabaseAdmin
          .from('design_elements')
          .select('*', { count: 'exact', head: true })
        designElementsCount = count
      }
    } catch {
      designElementsCount = null
    }
  }

  return {
    services: [
      {
        label: 'Supabase URL',
        configured: status.config.supabaseUrl,
        detail: status.config.supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : 'Nedostaje env var',
      },
      {
        label: 'Supabase Anon',
        configured: status.config.supabaseAnon,
        detail: status.config.supabaseAnon ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : 'Nedostaje env var',
      },
      {
        label: 'Supabase Service Role',
        configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        detail: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? 'CMS + design library spremni'
          : 'Dodaj SUPABASE_SERVICE_ROLE_KEY na Vercel',
      },
      {
        label: 'Admin Secret',
        configured: status.config.adminSecret,
        detail: status.config.adminSecret ? 'ADMIN_SECRET' : 'Nedostaje env var',
      },
      {
        label: 'DeepSeek AI',
        configured: Boolean(process.env.DEEPSEEK_API_KEY),
        detail: process.env.DEEPSEEK_API_KEY ? 'DEEPSEEK_API_KEY' : 'Dodaj ključ na Vercel',
      },
      {
        label: 'Google Gemini',
        configured: Boolean(process.env.GEMINI_API_KEY),
        detail: process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'Dodaj ključ na Vercel',
      },
      {
        label: 'Brevo (newsletter)',
        configured: Boolean(process.env.BREVO_API_KEY),
        detail: process.env.BREVO_API_KEY ? 'BREVO_API_KEY' : 'Opcionalno',
      },
      {
        label: 'Upstash Redis (rate limit)',
        configured: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
        detail: 'Admin login rate limit',
      },
    ],
    supabase: {
      serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      designElementsCount,
    },
  }
}
