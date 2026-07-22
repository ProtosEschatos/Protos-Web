'use server'

import { revalidatePath } from 'next/cache'
import { recordAudit } from '@/lib/audit/record'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  createAutomationWebhook,
  deleteAutomationWebhook,
  fireAutomationWebhook,
  listAutomationWebhooks,
  updateAutomationWebhook,
} from '@/lib/queries/admin/automations'
import {
  automationWebhookCreateSchema,
  automationWebhookUpdateSchema,
} from '@/lib/schemas/automation'
import type {
  AutomationFireResult,
  AutomationWebhookFormInput,
  AutomationWebhookListItem,
  AutomationWebhookUpdateInput,
} from '@/types/admin-automations'

const ADMIN_PATH = '/admin/automations'

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

export async function adminListAutomations(): Promise<Result<AutomationWebhookListItem[]>> {
  await requireAdmin()
  try {
    return ok(await listAutomationWebhooks())
  } catch (err) {
    return fail((err as Error).message)
  }
}

export async function adminCreateAutomation(
  input: AutomationWebhookFormInput,
): Promise<Result<{ id: string }>> {
  await requireAdmin()
  const parsed = automationWebhookCreateSchema.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues.map((i) => i.message).join('; '))

  try {
    const created = await createAutomationWebhook({
      name: parsed.data.name,
      url: parsed.data.url,
      method: parsed.data.method,
      event: parsed.data.event,
      authType: parsed.data.authType,
      authHeaderName: parsed.data.authHeaderName ?? null,
      authSecret: parsed.data.authSecret ?? null,
      headersJson: parsed.data.headersJson,
      bodyTemplate: parsed.data.bodyTemplate ?? null,
      notes: parsed.data.notes ?? null,
      isEnabled: parsed.data.isEnabled,
    })
    await recordAudit({
      event: 'automation.webhook.create.ok',
      source: 'admin-panel',
      payload: {
        id: created.id,
        name: parsed.data.name,
        event: parsed.data.event,
        method: parsed.data.method,
        // URL host only — do not log full URL (may contain path secrets in some setups).
        urlHost: safeUrlHost(parsed.data.url),
      },
    })
    revalidatePath(ADMIN_PATH)
    return ok(created)
  } catch (err) {
    const message = (err as Error).message
    await recordAudit({
      event: 'automation.webhook.create.error',
      source: 'admin-panel',
      payload: { name: parsed.data.name, error: message },
    })
    return fail(message)
  }
}

export async function adminUpdateAutomation(
  id: string,
  input: AutomationWebhookUpdateInput,
): Promise<Result> {
  await requireAdmin()
  const parsed = automationWebhookUpdateSchema.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues.map((i) => i.message).join('; '))

  try {
    await updateAutomationWebhook(id, {
      name: parsed.data.name,
      url: parsed.data.url,
      method: parsed.data.method,
      event: parsed.data.event,
      authType: parsed.data.authType,
      authHeaderName: parsed.data.authHeaderName ?? undefined,
      authSecret: parsed.data.authSecret ?? undefined,
      headersJson: parsed.data.headersJson,
      bodyTemplate: parsed.data.bodyTemplate,
      notes: parsed.data.notes ?? undefined,
      isEnabled: parsed.data.isEnabled,
      clearAuthSecret: parsed.data.clearAuthSecret,
    })
    await recordAudit({
      event: 'automation.webhook.update.ok',
      source: 'admin-panel',
      payload: {
        id,
        isEnabled: parsed.data.isEnabled,
        urlHost: parsed.data.url ? safeUrlHost(parsed.data.url) : undefined,
      },
    })
    revalidatePath(ADMIN_PATH)
    return ok()
  } catch (err) {
    const message = (err as Error).message
    await recordAudit({
      event: 'automation.webhook.update.error',
      source: 'admin-panel',
      payload: { id, error: message },
    })
    return fail(message)
  }
}

export async function adminDeleteAutomation(id: string): Promise<Result> {
  await requireAdmin()
  try {
    await deleteAutomationWebhook(id)
    await recordAudit({
      event: 'automation.webhook.delete.ok',
      source: 'admin-panel',
      payload: { id },
    })
    revalidatePath(ADMIN_PATH)
    return ok()
  } catch (err) {
    const message = (err as Error).message
    await recordAudit({
      event: 'automation.webhook.delete.error',
      source: 'admin-panel',
      payload: { id, error: message },
    })
    return fail(message)
  }
}

export async function adminFireAutomation(id: string): Promise<Result<AutomationFireResult>> {
  await requireAdmin()
  try {
    const result = await fireAutomationWebhook(id)
    await recordAudit({
      event: result.ok ? 'automation.webhook.fire.ok' : 'automation.webhook.fire.error',
      source: 'admin-panel',
      payload: {
        id,
        status: result.status,
        durationMs: result.durationMs,
        error: result.error,
      },
    })
    revalidatePath(ADMIN_PATH)
    return ok(result)
  } catch (err) {
    const message = (err as Error).message
    await recordAudit({
      event: 'automation.webhook.fire.error',
      source: 'admin-panel',
      payload: { id, error: message },
    })
    return fail(message)
  }
}

function safeUrlHost(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).host
  } catch {
    return null
  }
}
