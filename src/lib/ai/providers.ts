import 'server-only'

/**
 * Central AI provider layer for Protos Web admin tools.
 *
 * TWO public APIs live here:
 *
 * 1) Legacy explicit-provider chat API (used by /admin/ai chat panel):
 *    - AiProvider = 'gpt-oss' | 'deepseek' | 'gemini'
 *    - callAiProvider(provider, messages) → { content } | { error }
 *    - buildSystemPrompt / buildContentPrompt
 *    - getAiProviderStatus()
 *
 * 2) Cascade JSON API (used by /admin/seo AI studio + /admin/konfigurator
 *    scene chat). First configured provider in the order GPT-OSS → DeepSeek →
 *    Gemini is tried; each next one is failover:
 *    - callAiCascade(prompt, opts) → { content, provider }
 *    - callAiJsonCascade(prompt, maxTokens, systemPrompt?)
 *
 * Env vars honoured:
 *   GPT_OSS_API_KEY    – bearer token for the chosen OpenAI-compatible host
 *   GPT_OSS_BASE_URL   – default https://api.groq.com/openai/v1
 *                        (also works with Cerebras, OpenRouter, fal.ai,
 *                        HuggingFace TGI, vLLM, LM Studio, Ollama, …)
 *   GPT_OSS_MODEL      – default openai/gpt-oss-120b
 *   DEEPSEEK_API_KEY   – DeepSeek platform token
 *   DEEPSEEK_MODEL     – default deepseek-v4-pro
 *   GEMINI_API_KEY     – Google AI Studio key
 *   GEMINI_MODEL       – default gemini-2.0-flash
 */

export type AiProvider = 'gpt-oss' | 'deepseek' | 'gemini'

/** Alias for callers that need a stable name (does not lock the cascade). */
export type AiProviderId = AiProvider

export type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const DEFAULT_GPT_OSS_BASE_URL = 'https://api.groq.com/openai/v1'
const DEFAULT_GPT_OSS_MODEL = 'openai/gpt-oss-120b'
const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-v4-pro'
const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'
const DEFAULT_TIMEOUT_MS = 45_000

function trimEnv(name: string): string | undefined {
  const v = process.env[name]?.trim()
  return v && v.length > 0 ? v : undefined
}

// ─────────────────────────────────────────────────────────────────────────
// Low-level HTTP callers
// ─────────────────────────────────────────────────────────────────────────

type OpenAiCompatibleOpts = {
  temperature?: number
  maxTokens: number
  jsonMode?: boolean
  timeoutMs?: number
}

async function callOpenAiCompatibleChat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: AiMessage[],
  opts: OpenAiCompatibleOpts,
): Promise<string> {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: opts.temperature ?? 0.6,
    max_tokens: opts.maxTokens,
  }
  if (opts.jsonMode) body.response_format = { type: 'json_object' }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status}: ${text.slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('empty response')
  return content
}

async function callGeminiRaw(
  apiKey: string,
  model: string,
  messages: AiMessage[],
  opts: OpenAiCompatibleOpts,
): Promise<string> {
  const system = messages.find((m) => m.role === 'system')?.content
  const conversation = messages.filter((m) => m.role !== 'system')
  const promptParts = [
    system ? `System:\n${system}\n\n` : '',
    conversation
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}:\n${m.content}`)
      .join('\n\n'),
  ].join('')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: promptParts }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.6,
        maxOutputTokens: opts.maxTokens,
        responseMimeType: opts.jsonMode ? 'application/json' : 'text/plain',
      },
    }),
    signal: AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status}: ${text.slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!content) throw new Error('empty response')
  return content
}

// ─────────────────────────────────────────────────────────────────────────
// Public API 1: explicit-provider chat (legacy shape used by /admin/ai)
// ─────────────────────────────────────────────────────────────────────────

export async function callAiProvider(
  provider: AiProvider,
  messages: AiMessage[],
): Promise<{ content: string } | { error: string }> {
  try {
    if (provider === 'gpt-oss') {
      const key = trimEnv('GPT_OSS_API_KEY')
      if (!key) return { error: 'GPT_OSS_API_KEY nije postavljen na Vercelu' }
      const baseUrl = trimEnv('GPT_OSS_BASE_URL') ?? DEFAULT_GPT_OSS_BASE_URL
      const model = trimEnv('GPT_OSS_MODEL') ?? DEFAULT_GPT_OSS_MODEL
      const content = await callOpenAiCompatibleChat(baseUrl, key, model, messages, {
        temperature: 0.7,
        maxTokens: 2048,
      })
      return { content }
    }
    if (provider === 'deepseek') {
      const key = trimEnv('DEEPSEEK_API_KEY')
      if (!key) return { error: 'DEEPSEEK_API_KEY nije postavljen na Vercelu' }
      const model = trimEnv('DEEPSEEK_MODEL') ?? DEFAULT_DEEPSEEK_MODEL
      const content = await callOpenAiCompatibleChat(
        DEFAULT_DEEPSEEK_BASE_URL,
        key,
        model,
        messages,
        { temperature: 0.7, maxTokens: 2048 },
      )
      return { content }
    }
    // gemini
    const key = trimEnv('GEMINI_API_KEY')
    if (!key) return { error: 'GEMINI_API_KEY nije postavljen na Vercelu' }
    const model = trimEnv('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL
    const content = await callGeminiRaw(key, model, messages, {
      temperature: 0.7,
      maxTokens: 2048,
    })
    return { content }
  } catch (err) {
    return { error: (err as Error).message }
  }
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
  gptOss: boolean
  deepseek: boolean
  gemini: boolean
} {
  return {
    gptOss: Boolean(trimEnv('GPT_OSS_API_KEY')),
    deepseek: Boolean(trimEnv('DEEPSEEK_API_KEY')),
    gemini: Boolean(trimEnv('GEMINI_API_KEY')),
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Public API 2: cascade JSON (used by SEO studio + scene chat)
// ─────────────────────────────────────────────────────────────────────────

export type AiCallResult = {
  content: string
  provider: AiProvider
}

type CascadeOptions = {
  systemPrompt?: string
  temperature?: number
  maxTokens: number
  jsonMode?: boolean
  timeoutMs?: number
}

/** Tries each configured provider in order (GPT-OSS → DeepSeek → Gemini) and
 *  returns the first success. Throws with joined provider errors if none work. */
export async function callAiCascade(
  prompt: string,
  opts: CascadeOptions,
): Promise<AiCallResult> {
  const errors: string[] = []
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const messages: AiMessage[] = []
  if (opts.systemPrompt) messages.push({ role: 'system', content: opts.systemPrompt })
  messages.push({ role: 'user', content: prompt })

  const gptOssKey = trimEnv('GPT_OSS_API_KEY')
  if (gptOssKey) {
    const baseUrl = trimEnv('GPT_OSS_BASE_URL') ?? DEFAULT_GPT_OSS_BASE_URL
    const model = trimEnv('GPT_OSS_MODEL') ?? DEFAULT_GPT_OSS_MODEL
    try {
      const content = await callOpenAiCompatibleChat(baseUrl, gptOssKey, model, messages, {
        temperature: opts.temperature ?? 0.6,
        maxTokens: opts.maxTokens,
        jsonMode: opts.jsonMode,
        timeoutMs,
      })
      return { content, provider: 'gpt-oss' }
    } catch (err) {
      errors.push(`GPT-OSS (${model}): ${(err as Error).message}`)
    }
  }

  const deepseekKey = trimEnv('DEEPSEEK_API_KEY')
  if (deepseekKey) {
    const model = trimEnv('DEEPSEEK_MODEL') ?? DEFAULT_DEEPSEEK_MODEL
    try {
      const content = await callOpenAiCompatibleChat(
        DEFAULT_DEEPSEEK_BASE_URL,
        deepseekKey,
        model,
        messages,
        {
          temperature: opts.temperature ?? 0.6,
          maxTokens: opts.maxTokens,
          jsonMode: opts.jsonMode,
          timeoutMs,
        },
      )
      return { content, provider: 'deepseek' }
    } catch (err) {
      errors.push(`DeepSeek: ${(err as Error).message}`)
    }
  }

  const geminiKey = trimEnv('GEMINI_API_KEY')
  if (geminiKey) {
    const model = trimEnv('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL
    try {
      const content = await callGeminiRaw(geminiKey, model, messages, {
        temperature: opts.temperature ?? 0.6,
        maxTokens: opts.maxTokens,
        jsonMode: opts.jsonMode,
        timeoutMs,
      })
      return { content, provider: 'gemini' }
    } catch (err) {
      errors.push(`Gemini: ${(err as Error).message}`)
    }
  }

  if (errors.length === 0) {
    throw new Error(
      'Nema AI providera. Postavi barem jedan od GPT_OSS_API_KEY, DEEPSEEK_API_KEY ili GEMINI_API_KEY na Vercelu.',
    )
  }
  throw new Error(errors.join(' | '))
}

/** Convenience for JSON-mode calls (asks providers for pure JSON). */
export function callAiJsonCascade(prompt: string, maxTokens: number, systemPrompt?: string) {
  return callAiCascade(prompt, {
    maxTokens,
    systemPrompt: systemPrompt ?? 'Odgovaraj ISKLJUČIVO validnim JSON-om, bez markdown fenceova.',
    jsonMode: true,
    temperature: 0.6,
  })
}
