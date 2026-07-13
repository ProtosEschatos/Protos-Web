import {
  adminPrefixedLocaleRegexSource,
  isAdminPath,
} from '@/lib/auth/admin-paths'
import { LEGAL_TERMS_VERSION } from '@/lib/config/site'
import { SITE_CONSENT_KEY } from '@/lib/config/site-consent'

const ADMIN_PREFIXED_LOCALES_RE = adminPrefixedLocaleRegexSource()

export const BOOT_SESSION_KEY = 'protos-boot-gate-v11'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
export const BOOT_VIDEO = '/loader/boot-bg.mp4'
export const BOOT_BG = '#020818'

function readStoredConsent(): boolean {
  if (typeof window === 'undefined') return false
  const raw = localStorage.getItem(SITE_CONSENT_KEY)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { termsAccepted?: boolean; essential?: boolean; termsVersion?: string }
    return (
      parsed?.termsAccepted === true &&
      parsed?.essential === true &&
      parsed?.termsVersion === LEGAL_TERMS_VERSION
    )
  } catch {
    return false
  }
}

export function isBootComplete(): boolean {
  if (typeof window === 'undefined') return false
  if (sessionStorage.getItem(BOOT_SESSION_KEY) === '1') return true
  return readStoredConsent()
}

export function setBootPending(): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add('boot-pending')
}

export function clearBootPending(): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('boot-pending')
  document.documentElement.classList.add('boot-complete')
  document.body.style.overflow = ''
  removeBootSsrVeil()
}

export function removeBootSsrVeil(): void {
  if (typeof document === 'undefined') return
  const veil = document.getElementById('boot-ssr-veil')
  if (veil) veil.style.display = 'none'
}

/** Paths that must never show the public-site boot gate (admin, legal, showcase). */
export function isBootGateBypassPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]
  return (
    isAdminPath(path) ||
    path.includes('portfolio-showcase') ||
    /\/(terms|privacy|cookies)$/.test(path)
  )
}

/** Inline script for layout — admin locale segment from admin-paths.ts */
export const BOOT_GATE_INIT_SCRIPT = `(function(){try{var p=location.pathname;if(/^\\/admin(\\/|$)/.test(p)||/^\\/(${ADMIN_PREFIXED_LOCALES_RE})\\/admin(\\/|$)/.test(p)||p.indexOf('portfolio-showcase')!==-1||\\/(terms|privacy|cookies)$/.test(p)){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';return;}var k='${BOOT_SESSION_KEY}';var ck='${SITE_CONSENT_KEY}';var tv='${LEGAL_TERMS_VERSION}';var ok=false;if(sessionStorage.getItem(k)==='1')ok=true;else{var r=localStorage.getItem(ck);if(r){var p=JSON.parse(r);if(p&&p.termsAccepted&&p.essential&&p.termsVersion===tv)ok=true;}}if(ok){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';}else{document.documentElement.classList.add('boot-pending');}}catch(e){document.documentElement.classList.add('boot-pending');}})();`
