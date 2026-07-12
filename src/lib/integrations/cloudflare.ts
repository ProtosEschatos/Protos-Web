import { fetchWithTimeout, type IntegrationStatus } from './types'

/**
 * Live Cloudflare zone status for protosweb.eu. Needs a dedicated read-only
 * API token — deliberately separate from any DNS-editing token used by
 * local scripts (see docs/cloudflare-dns.md), to keep this admin-panel
 * credential's blast radius minimal (Zone → Zone → Read only).
 */
export async function getCloudflareStatus(): Promise<IntegrationStatus> {
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim()
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim()

  if (!token || !zoneId) {
    return {
      configured: false,
      hint: 'Postavi CLOUDFLARE_API_TOKEN (Zone:Read) i CLOUDFLARE_ZONE_ID na Vercelu',
    }
  }

  try {
    const res = await fetchWithTimeout(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = (await res.json()) as {
      success: boolean
      result?: { status: string; name: string; plan?: { name: string } }
      errors?: Array<{ message: string }>
    }

    if (!res.ok || !data.success || !data.result) {
      return {
        configured: true,
        ok: false,
        summary: `Cloudflare API greška`,
        detail: data.errors?.[0]?.message ?? `HTTP ${res.status}`,
      }
    }

    return {
      configured: true,
      ok: data.result.status === 'active',
      summary: `Zona: ${data.result.status}`,
      detail: `${data.result.name}${data.result.plan ? ` · ${data.result.plan.name}` : ''}`,
      href: 'https://dash.cloudflare.com',
    }
  } catch {
    return { configured: true, ok: false, summary: 'Mrežna greška', detail: 'Ne mogu dohvatiti Cloudflare API' }
  }
}
