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
  document.documentElement.classList.remove('boot-pending')
  document.documentElement.classList.add('boot-complete')
  document.body.style.overflow = ''
  removeBootSsrVeil()
}

export function removeBootSsrVeil(): void {
  if (typeof document === 'undefined') return
  // Hide instead of remove: the node is part of the React tree, so removing it
  // manually makes React's later reconciliation throw "removeChild not a child".
  const veil = document.getElementById('boot-ssr-veil')
  if (veil) veil.style.display = 'none'
}

/** Inline script for layout — must stay in sync with BOOT_SESSION_KEY */
export const BOOT_GATE_INIT_SCRIPT = `(function(){try{var k='${BOOT_SESSION_KEY}';if(sessionStorage.getItem(k)==='1'){document.documentElement.classList.remove('boot-pending');document.documentElement.classList.add('boot-complete');document.body.style.overflow='';var v=document.getElementById('boot-ssr-veil');if(v)v.style.display='none';}else{document.documentElement.classList.add('boot-pending');}}catch(e){document.documentElement.classList.add('boot-pending');}})();`
