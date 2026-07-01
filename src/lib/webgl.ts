export type WebGLSupport = {
  supported: boolean
  reason?: string
}

export function detectWebGLSupport(): WebGLSupport {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'ssr' }
  }

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext('experimental-webgl')

    if (!gl) {
      return { supported: false, reason: 'no-context' }
    }

    return { supported: true }
  } catch {
    return { supported: false, reason: 'exception' }
  }
}

export function isWebGLAvailable(): boolean {
  return detectWebGLSupport().supported
}
