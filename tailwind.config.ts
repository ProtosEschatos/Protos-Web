import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
      animation: {
        marquee: 'marquee 30s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        twinkle: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff6600, #ff8800)',
        'gradient-hero': 'linear-gradient(135deg, #ff6600, #8b5cf6, #06b6d4)',
        'gradient-cta': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
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
