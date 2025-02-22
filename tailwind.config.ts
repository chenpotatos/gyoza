import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{astro,ts,tsx,js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: [
        '"Noto Sans SC"',
        '"Source Han Sans SC"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Source Han Serif"', 'serif'],
      mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    extend: {
      colors: {
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      textColor: {
        primary: 'rgb(var(--color-text-primary))',
        secondary: 'rgb(var(--color-text-secondary))',
      },
      backgroundColor: {
        root: 'rgb(var(--color-bg-root))',
        primary: 'rgb(var(--color-bg-primary))',
        secondary: 'rgb(var(--color-bg-secondary))',
        card: 'var(--card-bg-primary)',
      },
      borderColor: {
        primary: 'rgb(var(--color-border-primary))',
      },
      minHeight: {
        main: 'calc(100vh - 200px)',
      },
      transitionProperty: {
        'bg-color': 'background-color',
      },
      zIndex: {
        '1': '1',
      },
      keyframes: {
        breath: {
          '0%': {
            transform: 'scale(0.60)',
            'box-shadow': '0 0 0 0 rgba(102, 187, 106, 0.6)',
          },
          '60%': {
            transform: 'scale(1)',
            'box-shadow': '0 0 0 36px rgba(204, 73, 152, 0)',
          },
          '100%': {
            transform: 'scale(0.60)',
            'box-shadow': '0 0 0 0 rgba(204, 73, 152, 0)',
          },
        },
      },
      animation: {
        breath: 'breath 2s ease-in-out infinite',
      },
      textStroke: {
        '-webkit-text-stroke': '2px rgb(var(--color-text-primary) / 0.1)',
      },
    },
  },
}

export default config
