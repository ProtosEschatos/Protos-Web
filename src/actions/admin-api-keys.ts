'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { isCryptoConfigured } from '@/lib/security/api-keys-crypto'
import {
  createAdminApiKey,
  deleteAdminApiKey,
  listAdminApiKeys,
  revealAdminApiKey,
  updateAdminApiKey,
} from '@/lib/queries/admin/api-keys'
import {
  apiKeyCreateSchema,
  apiKeyUpdateSchema,
} from '@/lib/schemas/api-key'
import type {
  AdminApiKeyFormInput,
  AdminApiKeyListItem,
  AdminApiKeyUpdateInput,
} from '@/types/admin-api-keys'

const ADMIN_PATH = '/admin/kljucevi'

type Result<T = void> =
  | ({ success: true } & (T extends void ? Record<string, never> : { data: T }))
  | { success: false; error: string }

function ok(): Result
function ok<T>(data: T): Result<T>
function ok<T>(data?: T): Result<T> {
  return (data === undefined ? { success: true } : { success: true, data }) as Result<T>
}

function fail(error: string): Result<never> {
  return { success: false, error }
}

export async function adminListApiKeys(): Promise<Result<AdminApiKeyListItem[]>> {
  await requireAdmin()
  if (!isCryptoConfigured()) return fail('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')
  try {
    return ok(await listAdminApiKeys())
  } catch (err) {
    return fail((err as Error).message)
  }
}

export async function adminCreateApiKey(input: AdminApiKeyFormInput): Promise<Result<{ id: string }>> {
  await requireAdmin()
  if (!isCryptoConfigured()) return fail('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')

  const parsed = apiKeyCreateSchema.safeParse(input)
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join('; '))
  }

  try {
    const created = await createAdminApiKey({
      provider: parsed.data.provider.toLowerCase(),
      label: parsed.data.label,
      envTarget: parsed.data.envTarget,
      value: parsed.data.value,
      notes: parsed.data.notes ?? null,
      isActive: parsed.data.isActive,
    })
    revalidatePath(ADMIN_PATH)
    return ok(created)
  } catch (err) {
    return fail((err as Error).message)
  }
}

export async function adminUpdateApiKey(
  id: string,
  input: AdminApiKeyUpdateInput,
): Promise<Result> {
  await requireAdmin()
  if (!isCryptoConfigured()) return fail('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')

  const parsed = apiKeyUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join('; '))
  }

  try {
    await updateAdminApiKey(id, {
      label: parsed.data.label,
      envTarget: parsed.data.envTarget,
      value: parsed.data.value ?? undefined,
      notes: parsed.data.notes ?? undefined,
      isActive: parsed.data.isActive,
    })
    revalidatePath(ADMIN_PATH)
    return ok()
  } catch (err) {
    return fail((err as Error).message)
  }
}

export async function adminDeleteApiKey(id: string): Promise<Result> {
  await requireAdmin()
  try {
    await deleteAdminApiKey(id)
    revalidatePath(ADMIN_PATH)
    return ok()
  } catch (err) {
    return fail((err as Error).message)
  }
}

export async function adminRevealApiKey(id: string): Promise<Result<{ value: string }>> {
  await requireAdmin()
  if (!isCryptoConfigured()) return fail('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')
  try {
    const value = await revealAdminApiKey(id)
    return ok({ value })
  } catch (err) {
    return fail((err as Error).message)
  }
}
