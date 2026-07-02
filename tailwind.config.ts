import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a1a',
          card: '#0f0f2a',
          'card-hover': '#141435',
          surface: '#12122a',
        },
        light: {
          DEFAULT: '#e8e8f0',
          muted: '#8888aa',
        },
        primary: {
          DEFAULT: '#ff6600',
          glow: 'rgba(255, 102, 0, 0.3)',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.3)',
        },
        accent: {
          DEFAULT: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(255, 255, 255, 0.06)',
        card: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
