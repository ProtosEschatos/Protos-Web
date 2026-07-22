import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminSession, ADMIN_COOKIE } from '@/lib/auth/admin-auth'
import { adminGetMemoryDoc } from '@/lib/queries/admin/memory'
import { memoryPath } from '@/lib/agent-memory'
import {
  buildContentPrompt,
  buildSystemPrompt,
  callAiProvider,
  type AiProvider,
} from '@/lib/ai/providers'
import { checkRateLimitStrict, getClientIp } from '@/lib/security/rate-limit'

// Cap admin-triggered generic AI calls: 10 per minute per IP. Prevents a
// leaked admin cookie from burning LLM credits at scale. Uses the strict
// variant so the first request is rate-limited too (avoids the deferred-
// decision window). Falls back to in-memory when Upstash env is absent.
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

type AiRequestBody = {
  provider?: AiProvider
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  task?: string
  context?: string
  useMemory?: boolean
}

export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = getClientIp(request)
  const rl = await checkRateLimitStrict('admin-ai', ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Previše zahtjeva. Pokušaj ponovno za ${rl.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  let body: AiRequestBody
  try {
    body = (await request.json()) as AiRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const provider: AiProvider =
    body.provider === 'gemini'
      ? 'gemini'
      : body.provider === 'gpt-oss'
        ? 'gpt-oss'
        : 'deepseek'

  let memoryContext: string | undefined
  if (body.useMemory) {
    try {
      const doc = await adminGetMemoryDoc(memoryPath('projects', 'protos-web.md'))
      memoryContext = doc?.content
    } catch {
      memoryContext = undefined
    }
  }

  const messages =
    body.messages && body.messages.length > 0
      ? [
          { role: 'system' as const, content: buildSystemPrompt(memoryContext) },
          ...body.messages.filter((m) => m.role !== 'system'),
        ]
      : body.task
        ? buildContentPrompt(body.task, body.context ?? '', memoryContext)
        : null

  if (!messages) {
    return NextResponse.json({ error: 'messages ili task su obavezni' }, { status: 400 })
  }

  const result = await callAiProvider(provider, messages)

  if ('error' in result) {
    const status = result.error.includes('nije postavljen') ? 503 : 502
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ content: result.content, provider })
}
