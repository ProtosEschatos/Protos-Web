export type IntegrationStatus =
  | { configured: false; hint: string }
  | { configured: true; ok: boolean; summary: string; detail?: string; href?: string }

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 6000,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' })
  } finally {
    clearTimeout(timer)
  }
}
