import 'server-only'
import { OTP } from 'otplib'

/**
 * TOTP second factor for admin login.
 *
 * Optional: if `ADMIN_TOTP_SECRET` is not set in env, 2FA is bypassed
 * (`is2FAEnabled()` returns false). Once you generate a secret and add it
 * to Vercel env vars, the login route will start requiring codes.
 *
 * Setup:
 *   1. Generate a secret with `generateAdminTotpSecret()` (or the CLI:
 *        node -e "import('otplib').then(m=>console.log(new m.OTP().generateSecret()))")
 *   2. Store in Vercel env as `ADMIN_TOTP_SECRET` (production + preview).
 *      DO NOT commit or share; treat as a password.
 *   3. Add to authenticator app (Google Authenticator, 1Password, Authy…).
 *      Use `buildAdminTotpUri(secret)` to produce a QR-scannable otpauth URI.
 *   4. Redeploy; first login will demand a 6-digit code.
 *
 * Recovery: if you lose the authenticator device, delete `ADMIN_TOTP_SECRET`
 * from env, redeploy — login falls back to password-only until re-enrolled.
 */

// Lazy singleton — TOTP configured with standard defaults (30s step, ±1
// step tolerance for clock skew) and default sha1/6-digit RFC 6238 profile.
let cachedOtp: OTP | null = null
function getOtp(): OTP {
  if (!cachedOtp) cachedOtp = new OTP({ strategy: 'totp' })
  return cachedOtp
}

export function is2FAEnabled(): boolean {
  return Boolean(process.env.ADMIN_TOTP_SECRET?.trim())
}

export function verifyTotpCode(code: string | undefined | null): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET?.trim()
  if (!secret) return false
  const cleaned = (code ?? '').replace(/\s+/g, '').trim()
  if (!/^\d{6}$/.test(cleaned)) return false
  try {
    const result = getOtp().verifySync({
      token: cleaned,
      secret,
      period: 30,
      digits: 6,
      // ±1 step tolerance for clock skew: reject nothing older than 30s past,
      // nothing newer than 30s future.
      epochTolerance: [30, 30],
    })
    return result.valid === true
  } catch {
    return false
  }
}

export function generateAdminTotpSecret(): string {
  return getOtp().generateSecret()
}

export function buildAdminTotpUri(secret: string, label = 'admin@protosweb.eu'): string {
  return getOtp().generateURI({
    issuer: 'Protos Web',
    label,
    secret,
    period: 30,
    digits: 6,
  })
}
