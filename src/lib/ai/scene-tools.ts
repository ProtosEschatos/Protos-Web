import 'server-only'
import { sceneCommandBatch, type SceneCommandBatch } from '@/lib/schemas/scene-command'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

type SceneContext = {
  primitive: string
  color: string
  environment: string
  gltfLoaded: boolean
}

const COMMAND_HELP = `
Dostupne komande (vraćaš ARRAY objekata pod ključem "commands"):

1. { "type": "set_primitive", "primitive": "box" | "sphere" | "torus" }
2. { "type": "set_color", "color": "#RRGGBB" }
3. { "type": "set_material", "metalness"?: 0..1, "roughness"?: 0..1, "emissive"?: "#RRGGBB", "emissiveIntensity"?: 0..4, "wireframe"?: bool }
4. { "type": "set_environment", "environment"?: "studio"|"sunset"|"dawn"|"night"|"warehouse"|"forest"|"apartment"|"city"|"park"|"lobby", "environmentIntensity"?: 0..3 }
5. { "type": "set_lighting", "ambient"?: 0..2, "directional"?: 0..3 }
6. { "type": "set_background", "color": "#RRGGBB" }
7. { "type": "set_auto_rotate", "enabled": bool }
8. { "type": "import_model", "source": "sketchfab"|"poly-pizza"|"url", "query": "search string ili URL" }
9. { "type": "reset_scene" }
`.trim()

function buildSystemPrompt(current?: SceneContext): string {
  return [
    'Ti si asistent za 3D konfigurator (React Three Fiber) na admin panelu Protos Web studija.',
    'Korisnik ti daje kratke prompte u prirodnom jeziku (hrvatski ili engleski).',
    'Odgovaraš ISKLJUČIVO validnim JSON-om s ključevima "commands" (array) i opcionalno "narration" (kratka poruka useru na hrvatskom).',
    'Nikakav tekst izvan JSON-a, nikakvi Markdown code fenceovi.',
    '',
    'PRIMJER prompta: "napravi crvenu kocku, emisivnu, u sunset okolišu"',
    'PRIMJER odgovora:',
    '{"commands":[{"type":"set_primitive","primitive":"box"},{"type":"set_color","color":"#e11d48"},{"type":"set_material","emissive":"#e11d48","emissiveIntensity":0.6},{"type":"set_environment","environment":"sunset"}],"narration":"Postavio crvenu kocku sa emissive, sunset HDRI."}',
    '',
    'PRIMJER prompta: "uvezi pizzu"',
    'PRIMJER odgovora:',
    '{"commands":[{"type":"import_model","source":"poly-pizza","query":"pizza"}],"narration":"Tražim pizza model na Poly.Pizza."}',
    '',
    COMMAND_HELP,
    '',
    current
      ? `Trenutno stanje scene: primitive=${current.primitive}, color=${current.color}, environment=${current.environment}, gltfLoaded=${current.gltfLoaded}.`
      : '',
    'Ako nešto nije jasno, koristi razumne default vrijednosti. Ne postavljaj `import_model` ako je user već tražio primitive; ne resetiraj scenu osim ako user eksplicitno traži.',
  ].filter(Boolean).join('\n')
}

async function callDeepSeek(prompt: string, current?: SceneContext): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY?.trim()
  if (!key) throw new Error('DEEPSEEK_API_KEY nije postavljen')

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: buildSystemPrompt(current) },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    throw new Error(`DeepSeek ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`)
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('DeepSeek nije vratio sadržaj')
  return content
}

async function callGemini(prompt: string, current?: SceneContext): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim()
  if (!key) throw new Error('GEMINI_API_KEY nije postavljen')

  const url = `${GEMINI_BASE}/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${buildSystemPrompt(current)}\n\nUpit: ${prompt}` }] },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!content) throw new Error('Gemini nije vratio sadržaj')
  return content
}

function stripFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

export type SceneAiResult =
  | { ok: true; batch: SceneCommandBatch; provider: 'deepseek' | 'gemini' }
  | { ok: false; error: string }

export async function generateSceneCommands(
  prompt: string,
  current?: SceneContext,
): Promise<SceneAiResult> {
  const hasDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY?.trim())
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim())

  if (!hasDeepSeek && !hasGemini) {
    return { ok: false, error: 'Nema AI providera. Postavi DEEPSEEK_API_KEY ili GEMINI_API_KEY na Vercelu.' }
  }

  const providers: Array<'deepseek' | 'gemini'> = []
  if (hasDeepSeek) providers.push('deepseek')
  if (hasGemini) providers.push('gemini')

  let lastError = ''
  for (const provider of providers) {
    try {
      const raw = provider === 'deepseek' ? await callDeepSeek(prompt, current) : await callGemini(prompt, current)
      const parsed = JSON.parse(stripFences(raw))
      const validation = sceneCommandBatch.safeParse(parsed)
      if (!validation.success) {
        lastError = `Neispravan format komandi (${provider}): ${validation.error.issues.slice(0, 2).map((i) => i.message).join('; ')}`
        continue
      }
      return { ok: true, batch: validation.data, provider }
    } catch (err) {
      lastError = (err as Error).message
      continue
    }
  }

  return { ok: false, error: lastError || 'Nijedan AI provider nije uspio' }
}
