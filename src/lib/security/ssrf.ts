/**
 * SSRF (Server-Side Request Forgery) defense.
 *
 * Two-layer protection for outbound HTTP requests to admin-configured URLs
 * (webhooks, integrations):
 *
 *   1. `isBlockedHostLiteral(host)` — synchronous check for literal private
 *      IPs / loopback / link-local / RFC1918. Cheap, used in Zod schemas.
 *   2. `assertPublicUrl(url)` — asynchronous DNS resolution + IP validation.
 *      Called immediately before `fetch(url)` in the request pipeline.
 *
 * NOTE: this pair does NOT close the DNS-rebinding race window (Node's built-in
 * `fetch` re-resolves DNS internally and cannot be forced to a pre-resolved
 * IP without dropping to `undici` low-level connect). The race is narrow in
 * practice for typical webhook targets. For hard SSRF isolation, run the
 * webhook dispatcher behind a dedicated egress proxy that also enforces IP
 * allowlist / blocklist at network layer.
 */

import { promises as dnsPromises } from 'node:dns'
import { isIP } from 'node:net'

export class SsrfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SsrfError'
  }
}

/**
 * IPv4 CIDR blocklist. Covers RFC1918, loopback, link-local, CGN, TEST-NET,
 * multicast, and reserved space.
 */
const BLOCKED_IPV4_CIDRS: ReadonlyArray<{ base: string; mask: number }> = [
  { base: '0.0.0.0', mask: 8 },
  { base: '10.0.0.0', mask: 8 },
  { base: '100.64.0.0', mask: 10 },
  { base: '127.0.0.0', mask: 8 },
  { base: '169.254.0.0', mask: 16 },
  { base: '172.16.0.0', mask: 12 },
  { base: '192.0.0.0', mask: 24 },
  { base: '192.0.2.0', mask: 24 },
  { base: '192.168.0.0', mask: 16 },
  { base: '198.18.0.0', mask: 15 },
  { base: '198.51.100.0', mask: 24 },
  { base: '203.0.113.0', mask: 24 },
  { base: '224.0.0.0', mask: 4 },
  { base: '240.0.0.0', mask: 4 },
]

function ipv4ToNum(ip: string): number {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return -1
  }
  return (
    ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0
  )
}

function isIpv4Blocked(ip: string): boolean {
  const num = ipv4ToNum(ip)
  if (num < 0) return true // malformed → treat as blocked
  return BLOCKED_IPV4_CIDRS.some(({ base, mask }) => {
    const baseNum = ipv4ToNum(base)
    const maskNum = mask === 0 ? 0 : (~0 << (32 - mask)) >>> 0
    return (num & maskNum) === (baseNum & maskNum)
  })
}

function isIpv6Blocked(ip: string): boolean {
  const lower = ip.toLowerCase()
  if (lower === '::1' || lower === '::') return true
  // IPv4-mapped ::ffff:x.x.x.x — check underlying IPv4 against blocklist.
  const ipv4Mapped = lower.match(/^::ffff:([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})$/)
  if (ipv4Mapped) return isIpv4Blocked(ipv4Mapped[1]!)
  // IPv4-mapped ::ffff:aabb:ccdd (hex form) — decode and check.
  const ipv4MappedHex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (ipv4MappedHex) {
    const hi = parseInt(ipv4MappedHex[1]!, 16)
    const lo = parseInt(ipv4MappedHex[2]!, 16)
    const dotted = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`
    return isIpv4Blocked(dotted)
  }
  // Unique local fc00::/7 (fc/fd prefix).
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true
  // Link-local fe80::/10.
  if (/^fe[89ab][0-9a-f]:/.test(lower)) return true
  // Multicast / reserved ff00::/8.
  if (/^ff[0-9a-f]{2}:/.test(lower)) return true
  return false
}

export function isPrivateIp(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return isIpv4Blocked(ip)
  if (family === 6) return isIpv6Blocked(ip)
  return true // unknown / unparseable → block
}

/**
 * Cheap synchronous check on the host component of a URL literal. Rejects:
 * - `localhost`, `*.localhost`
 * - Any RFC1918 / loopback / link-local / CGN IPv4 literal
 * - `::1`, `::`, IPv6 unique local (fc/fd), link-local (fe80::/10),
 *   IPv4-mapped IPv6, multicast, reserved
 *
 * Useful in Zod schemas at admin-write time. Not authoritative — a public
 * hostname can still resolve to a private IP. Pair with `assertPublicUrl`.
 */
export function isBlockedHostLiteral(rawUrl: string): boolean {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return true
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host) return true
  if (host === 'localhost' || host.endsWith('.localhost')) return true

  const family = isIP(host)
  if (family === 4) return isIpv4Blocked(host)
  if (family === 6) return isIpv6Blocked(host)

  // Otherwise a real hostname — allow (authoritative check happens at fetch).
  return false
}

/**
 * Resolve the URL's hostname and ensure NO resolved IP falls in a blocked
 * range. Call immediately before `fetch(url)`. Throws `SsrfError` on any
 * private IP.
 */
export async function assertPublicUrl(rawUrl: string): Promise<void> {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new SsrfError('URL nije valjan')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new SsrfError(`Protokol ${url.protocol} nije dozvoljen`)
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host) throw new SsrfError('Host je prazan')

  // Literal IP → check directly.
  const literalFamily = isIP(host)
  if (literalFamily) {
    if (isPrivateIp(host)) throw new SsrfError(`Blokiran interni IP: ${host}`)
    return
  }

  if (host === 'localhost' || host.endsWith('.localhost')) {
    throw new SsrfError(`Blokiran host: ${host}`)
  }

  // DNS resolve — check ALL resolved addresses.
  let results: Array<{ address: string; family: number }>
  try {
    results = await dnsPromises.lookup(host, { all: true })
  } catch (err) {
    throw new SsrfError(`DNS lookup neuspio za ${host}: ${(err as Error).message}`)
  }
  for (const { address } of results) {
    if (isPrivateIp(address)) {
      throw new SsrfError(`Host ${host} razrješuje u interni IP ${address}`)
    }
  }
}
