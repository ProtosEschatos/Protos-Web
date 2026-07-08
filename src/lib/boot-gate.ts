export const BOOT_SESSION_KEY = 'protos-boot-gate-v10'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
export const BOOT_VIDEO = '/loader/boot-bg.mp4'
export const BOOT_BG = '#020818'

export function isBootComplete(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(BOOT_SESSION_KEY) === '1'
}

export function setBootPending(): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add('boot-pending')
}

export function clearBootPending(): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('boot-pending', 'cursor-none')
  document.documentElement.classList.add('boot-complete')
  document.body.style.overflow = ''
  removeBootSsrVeil()
}

export function removeBootSsrVeil(): void {
  if (typeof document === 'undefined') return
  document.getElementById('boot-ssr-veil')?.remove()
}

/** Inline script for layout — must stay in sync with BOOT_SESSION_KEY */
export const BOOT_GATE_INIT_SCRIPT = `(function(){try{var k='${BOOT_SESSION_KEY}';document.documentElement.classList.remove('cursor-none');if(sessionStorage.getItem(k)==='1'){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.remove();}else{document.documentElement.classList.add('boot-pending');}}catch(e){document.documentElement.classList.add('boot-pending');}})();`
