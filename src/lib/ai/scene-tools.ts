import 'server-only'
import { sceneCommandBatch, type SceneCommandBatch } from '@/lib/schemas/scene-command'
import { callAiCascade, type AiProviderId } from '@/lib/ai/providers'

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

function stripFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

export type SceneAiResult =
  | { ok: true; batch: SceneCommandBatch; provider: AiProviderId }
  | { ok: false; error: string }

export async function generateSceneCommands(
  prompt: string,
  current?: SceneContext,
): Promise<SceneAiResult> {
  try {
    const { content, provider } = await callAiCascade(prompt, {
      systemPrompt: buildSystemPrompt(current),
      temperature: 0.3,
      maxTokens: 1024,
      jsonMode: true,
      timeoutMs: 15_000,
    })
    const parsed = JSON.parse(stripFences(content))
    const validation = sceneCommandBatch.safeParse(parsed)
    if (!validation.success) {
      return {
        ok: false,
        error: `Neispravan format komandi (${provider}): ${validation.error.issues
          .slice(0, 2)
          .map((i) => i.message)
          .join('; ')}`,
      }
    }
    return { ok: true, batch: validation.data, provider }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
