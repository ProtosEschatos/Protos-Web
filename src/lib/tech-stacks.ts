/** Public-facing tech stacks — languages & build tools only (no infra services). */

export type TechStack = {
  id: string
  items: string[]
}

export const PROTOS_WEB_STACK: TechStack = {
  id: 'protos-web',
  items: [
    'TypeScript',
    'HTML',
    'CSS',
    'Next.js',
    'React',
    'Three.js',
    'WebGL',
    'GLSL',
    'Tailwind CSS',
    'Framer Motion',
  ],
}

export const BODULICA_STACK: TechStack = {
  id: 'bodulica-shop',
  items: ['HTML', 'CSS', 'Vanilla JavaScript'],
}

/** Uppercase labels for portfolio marquee */
export const PROTOS_WEB_MARQUEE = PROTOS_WEB_STACK.items.map((item) =>
  item.replace(/\s+/g, ' ').toUpperCase(),
)
