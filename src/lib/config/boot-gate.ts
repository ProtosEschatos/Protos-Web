import { adminPrefixedLocaleRegexSource } from '@/lib/auth/admin-paths'

export const BOOT_SESSION_KEY = 'protos-boot-gate-v12'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
export const BOOT_VIDEO = '/loader/boot-bg.mp4'
export const BOOT_BG = '#020818'

const PREFIXED_LOCALES = adminPrefixedLocaleRegexSource()

/** Boot animation finished this browser session (Enter clicked). */
export function isBootComplete(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(BOOT_SESSION_KEY) === '1'
}

export function setBootPending(): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add('boot-pending')
  document.documentElement.classList.remove('boot-complete')
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

export function isLegalPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]
  return /\/(terms|privacy|cookies)$/.test(path)
}

/** Paths that must never show the public-site boot gate (admin, legal, showcase). */
export function isBootGateBypassPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]
  const prefixedAdmin = new RegExp(`^/(${PREFIXED_LOCALES})/admin(/|$)`)
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    prefixedAdmin.test(path) ||
    path.includes('portfolio-showcase') ||
    isLegalPath(path)
  )
}

/** Inline script for layout — must stay in sync with BOOT_SESSION_KEY */
export const BOOT_GATE_INIT_SCRIPT = `(function(){try{var p=location.pathname;if(/^\\/admin(\\/|$)/.test(p)||new RegExp("^\\/(${PREFIXED_LOCALES})\\/admin(\\\\/|$)").test(p)||p.indexOf('portfolio-showcase')!==-1||\\/(terms|privacy|cookies)$/.test(p)){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';return;}var k='${BOOT_SESSION_KEY}';var ok=sessionStorage.getItem(k)==='1';if(ok){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';}else{document.documentElement.classList.add('boot-pending');}}catch(e){document.documentElement.classList.add('boot-pending');}})();`
