import { LEGAL_TERMS_VERSION } from '@/lib/site'
import { SITE_CONSENT_KEY } from '@/lib/site-consent'

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

/** Inline script for layout — must stay in sync with BOOT_SESSION_KEY + SITE_CONSENT_KEY */
export const BOOT_GATE_INIT_SCRIPT = `(function(){try{var k='${BOOT_SESSION_KEY}';var ck='${SITE_CONSENT_KEY}';var tv='${LEGAL_TERMS_VERSION}';var ok=false;if(sessionStorage.getItem(k)==='1')ok=true;else{var r=localStorage.getItem(ck);if(r){var p=JSON.parse(r);if(p&&p.termsAccepted&&p.essential&&p.termsVersion===tv)ok=true;}}if(ok){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';}else{document.documentElement.classList.add('boot-pending');}}catch(e){document.documentElement.classList.add('boot-pending');}})();`
