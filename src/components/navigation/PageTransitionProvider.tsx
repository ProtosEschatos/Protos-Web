'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from '@/routing'
import {
  getTransitionDestinationKey,
  normalizeHref,
  type TransitionDestinationKey,
} from '@/lib/main-nav-routes'

type TransitionPhase = 'idle' | 'exit' | 'loading' | 'enter'

type PageTransitionContextValue = {
  isTransitioning: boolean
  phase: TransitionPhase
  destinationKey: TransitionDestinationKey | null
  startTransition: (href: string) => void
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)

const EXIT_MS = 1200
const LOADING_MS = 600
const ENTER_MS = 1000

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [destinationKey, setDestinationKey] = useState<TransitionDestinationKey | null>(null)
  const runningRef = useRef(false)

  const startTransition = useCallback(
    async (href: string) => {
      const target = normalizeHref(href)
      const current = normalizeHref(pathname)

      if (runningRef.current || target === current) return

      runningRef.current = true
      setDestinationKey(getTransitionDestinationKey(href))
      setPhase('exit')
      document.body.style.overflow = 'hidden'

      await sleep(EXIT_MS)
      setPhase('loading')
      router.push(href)
      window.scrollTo(0, 0)

      await sleep(LOADING_MS)
      setPhase('enter')

      await sleep(ENTER_MS)
      setPhase('idle')
      setDestinationKey(null)
      document.body.style.overflow = ''
      runningRef.current = false
    },
    [pathname, router],
  )

  useEffect(() => {
    if (phase === 'idle') {
      document.body.style.overflow = ''
    }
  }, [phase])

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning: phase !== 'idle',
        phase,
        destinationKey,
        startTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) {
    throw new Error('usePageTransition must be used within PageTransitionProvider')
  }
  return ctx
}
