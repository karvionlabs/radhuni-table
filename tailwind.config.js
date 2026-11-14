/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        culinary: {
          dark: '#0A0C0E',
          card: '#12161A',
          cardHover: '#1A2026',
          border: '#2A323D',
          gold: '#E5A93C',
          goldLight: '#F3C56D',
          emerald: '#059669',
          terracotta: '#E05338',
          smoke: '#94A3B8',
          cream: '#FDFBF7'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'steam-slow': 'steam 6s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        steam: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translateY(-14px) scale(1.08)', opacity: '0.75' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
