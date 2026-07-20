import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_BYTES = 32
const IV_BYTES = 12

/**
 * Loads the master encryption key from ADMIN_KEYS_ENCRYPTION_KEY.
 * Expects a base64-encoded 32-byte key. Throws if missing / malformed.
 *
 * Generate one locally with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */
function getMasterKey(): Buffer {
  const raw = process.env.ADMIN_KEYS_ENCRYPTION_KEY?.trim()
  if (!raw) {
    throw new Error('ADMIN_KEYS_ENCRYPTION_KEY missing (base64 32-byte key)')
  }
  const key = Buffer.from(raw, 'base64')
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `ADMIN_KEYS_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${key.length})`,
    )
  }
  return key
}

export function isCryptoConfigured(): boolean {
  try {
    getMasterKey()
    return true
  } catch {
    return false
  }
}

export type EncryptedPayload = {
  ciphertext: string
  iv: string
  authTag: string
}

export function encryptSecret(plaintext: string): EncryptedPayload {
  const key = getMasterKey()
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return {
    ciphertext: enc.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  }
}

export function decryptSecret(payload: EncryptedPayload): string {
  const key = getMasterKey()
  const iv = Buffer.from(payload.iv, 'base64')
  const authTag = Buffer.from(payload.authTag, 'base64')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  const dec = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64')),
    decipher.final(),
  ])
  return dec.toString('utf8')
}

/**
 * Safe-to-store masked hint. Reveals the first 4 and last 4 chars for
 * identification without exposing the secret. Short values are fully masked.
 */
export function maskSecret(plaintext: string): string {
  const value = plaintext.trim()
  if (value.length <= 8) return '••••'
  const head = value.slice(0, 4)
  const tail = value.slice(-4)
  return `${head}…${tail}`
}
