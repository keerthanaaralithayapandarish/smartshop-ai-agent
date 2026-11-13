/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dde6f2',
          200: '#bfd2e6',
          300: '#94b5d4',
          400: '#6493be',
          500: '#4376a7',
          600: '#325e8b',
          700: '#294c71',
          800: '#1b324d',
          900: '#0f1f33',
          950: '#070f1a',
        },
        electric: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bce0ff',
          300: '#8ecaff',
          400: '#53abff',
          500: '#2b8aff',
          600: '#0066ff',
          700: '#0052db',
          800: '#0043b3',
          900: '#053a8d',
          950: '#042459',
        },
        amazon: {
          DEFAULT: '#ff9900',
          dark: '#131921',
          light: '#232f3e',
        },
        flipkart: {
          DEFAULT: '#2874f0',
          yellow: '#ffe11b',
        },
        croma: {
          DEFAULT: '#00e9bf',
          dark: '#121212',
          teal: '#008374',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(11, 23, 42, 0.05), 0 2px 6px -1px rgba(11, 23, 42, 0.02)',
        'card-hover': '0 20px 35px -6px rgba(0, 102, 255, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glow-electric': '0 0 25px -4px rgba(0, 102, 255, 0.35)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.35)',
        'premium': '0 20px 50px -12px rgba(15, 31, 51, 0.15)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
