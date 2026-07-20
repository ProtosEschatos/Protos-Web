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

type AiRequestBody = {
  provider?: AiProvider
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  task?: string
  context?: string
  useMemory?: boolean
}

export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
