import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminSession, ADMIN_COOKIE } from '@/lib/admin-auth'
import { callAiProvider, buildContentPrompt, type AiProvider } from '@/lib/ai/providers'

type AiRequestBody = {
  provider?: AiProvider
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  task?: string
  context?: string
}

export async function POST(request: Request) {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: AiRequestBody
  try {
    body = (await request.json()) as AiRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const provider: AiProvider = body.provider === 'gemini' ? 'gemini' : 'deepseek'

  const messages =
    body.messages && body.messages.length > 0
      ? body.messages
      : body.task
        ? buildContentPrompt(body.task, body.context ?? '')
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
