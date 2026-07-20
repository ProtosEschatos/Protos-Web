import type { z } from 'zod'

export type ParseSuccess<T> = { ok: true; data: T }
export type ParseFailure = { ok: false; error: string; details: Record<string, string> }
export type ParseResult<T> = ParseSuccess<T> | ParseFailure

/**
 * Parse a Request body as JSON and validate it against a Zod schema.
 *
 * On success returns `{ ok: true, data }`. On failure returns `{ ok: false, error, details }`
 * where `error` is the first human-readable message and `details` maps each failing field path
 * (dot-joined) to its message — ready to pass into a Next.js `NextResponse.json(...)` body.
 */
export async function parseRequestJson<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return { ok: false, error: 'Invalid JSON body', details: {} }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const details: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : '_'
      if (!(path in details)) details[path] = issue.message
    }
    return {
      ok: false,
      error: result.error.issues[0]?.message ?? 'Invalid payload',
      details,
    }
  }

  return { ok: true, data: result.data }
}
