import { z } from 'zod'

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Boja mora biti #RRGGBB hex zapis')

const environmentEnum = z.enum([
  'studio',
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'city',
  'park',
  'lobby',
])

const primitiveEnum = z.enum(['box', 'sphere', 'torus'])

export const setPrimitiveCommand = z.object({
  type: z.literal('set_primitive'),
  primitive: primitiveEnum,
})

export const setColorCommand = z.object({
  type: z.literal('set_color'),
  color: hexColor,
})

export const setMaterialCommand = z.object({
  type: z.literal('set_material'),
  metalness: z.number().min(0).max(1).optional(),
  roughness: z.number().min(0).max(1).optional(),
  emissive: hexColor.optional(),
  emissiveIntensity: z.number().min(0).max(4).optional(),
  wireframe: z.boolean().optional(),
})

export const setEnvironmentCommand = z.object({
  type: z.literal('set_environment'),
  environment: environmentEnum.optional(),
  environmentIntensity: z.number().min(0).max(3).optional(),
})

export const setLightingCommand = z.object({
  type: z.literal('set_lighting'),
  ambient: z.number().min(0).max(2).optional(),
  directional: z.number().min(0).max(3).optional(),
})

export const setBackgroundCommand = z.object({
  type: z.literal('set_background'),
  color: hexColor,
})

export const setAutoRotateCommand = z.object({
  type: z.literal('set_auto_rotate'),
  enabled: z.boolean(),
})

export const importModelCommand = z.object({
  type: z.literal('import_model'),
  source: z.enum(['sketchfab', 'poly-pizza', 'url']),
  query: z.string().min(2).max(120),
})

export const resetSceneCommand = z.object({
  type: z.literal('reset_scene'),
})

export const sceneCommand = z.discriminatedUnion('type', [
  setPrimitiveCommand,
  setColorCommand,
  setMaterialCommand,
  setEnvironmentCommand,
  setLightingCommand,
  setBackgroundCommand,
  setAutoRotateCommand,
  importModelCommand,
  resetSceneCommand,
])

export type SceneCommand = z.infer<typeof sceneCommand>

export const sceneCommandBatch = z.object({
  commands: z.array(sceneCommand).min(1).max(10),
  narration: z.string().max(500).optional(),
})

export type SceneCommandBatch = z.infer<typeof sceneCommandBatch>

export const scenePromptRequest = z.object({
  prompt: z.string().min(2).max(1000),
  currentState: z
    .object({
      primitive: z.string(),
      color: z.string(),
      environment: z.string(),
      gltfLoaded: z.boolean(),
    })
    .optional(),
})

export type ScenePromptRequest = z.infer<typeof scenePromptRequest>
