/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary teal — DocHub BD brand
        teal: {
          50:  '#f0fdfc',
          100: '#ccfbf7',
          200: '#99f6ee',
          300: '#5eead8',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Slate neutrals
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Accent amber for ratings / highlights
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        // Soft rose for emergency
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        // Emerald for verified / online badges
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },

      fontFamily: {
        // Display — editorial elegance
        display: ['var(--font-display)', 'Georgia', 'serif'],
        // Body — clean legible sans
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Mono
        mono: ['var(--font-mono)', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 16px -2px rgb(0 0 0 / 0.08)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 12px 32px -4px rgb(0 0 0 / 0.12)',
        'nav': '0 1px 0 0 rgb(0 0 0 / 0.06)',
        'teal': '0 4px 14px 0 rgb(15 118 110 / 0.28)',
        'teal-lg': '0 8px 24px 0 rgb(15 118 110 / 0.32)',
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },

      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
        'hero-mesh': 'radial-gradient(at 40% 20%, rgb(15 118 110 / 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(20 184 166 / 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(13 148 136 / 0.06) 0px, transparent 50%)',
        'card-shine': 'linear-gradient(135deg, rgb(255 255 255 / 0.05) 0%, transparent 60%)',
        'dot-pattern': "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
      },

      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '28px 28px',
      },

      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-down': 'slide-down 0.2s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
      },

      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};