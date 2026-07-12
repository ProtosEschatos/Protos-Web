export type AiProvider = 'deepseek' | 'gemini'

export type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

export async function callAiProvider(
  provider: AiProvider,
  messages: AiMessage[],
): Promise<{ content: string } | { error: string }> {
  if (provider === 'deepseek') {
    const key = process.env.DEEPSEEK_API_KEY
    if (!key) return { error: 'DEEPSEEK_API_KEY nije postavljen na Vercelu' }

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        // `deepseek-chat` is a legacy alias (routes to V4-Flash, non-thinking)
        // retiring 2026-07-24 — use the V4-Pro model id directly.
        model: 'deepseek-v4-pro',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: `DeepSeek ${res.status}: ${text.slice(0, 200)}` }
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) return { error: 'DeepSeek nije vratio sadržaj' }
    return { content }
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) return { error: 'GEMINI_API_KEY nije postavljen na Vercelu' }

  const system = messages.find((m) => m.role === 'system')?.content
  const conversation = messages.filter((m) => m.role !== 'system')
  const lastUser = [...conversation].reverse().find((m) => m.role === 'user')
  if (!lastUser) return { error: 'Nema user poruke' }

  const promptParts = [
    system ? `System:\n${system}\n\n` : '',
    conversation
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}:\n${m.content}`)
      .join('\n\n'),
  ].join('')

  const model = 'gemini-2.0-flash'
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${encodeURIComponent(key)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptParts }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { error: `Gemini ${res.status}: ${text.slice(0, 200)}` }
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!content) return { error: 'Gemini nije vratio sadržaj' }
  return { content }
}

export function buildSystemPrompt(memoryContext?: string): string {
  const base =
    'Ti si pomoćnik za Protos Web studio (Zagreb). Piši jasno, profesionalno, na hrvatskom osim ako je zadatak prijevod. Vraćaj samo traženi sadržaj bez meta komentara.'
  if (!memoryContext?.trim()) return base
  return `${base}\n\nKontekst projekta (Protos-Agent memorija):\n${memoryContext.slice(0, 12000)}`
}

export function buildContentPrompt(
  task: string,
  context: string,
  memoryContext?: string,
): AiMessage[] {
  return [
    { role: 'system', content: buildSystemPrompt(memoryContext) },
    { role: 'user', content: `Zadatak: ${task}\n\nKontekst:\n${context}` },
  ]
}

export function getAiProviderStatus(): {
  deepseek: boolean
  gemini: boolean
} {
  return {
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY?.trim()),
    gemini: Boolean(process.env.GEMINI_API_KEY?.trim()),
  }
}
