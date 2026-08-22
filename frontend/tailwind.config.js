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
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        page: {
          light: '#FAF9FF',
          dark: '#0F1020',
        },
        sidebar: {
          light: '#FFFFFF',
          dark: '#121329',
        },
        card: {
          light: '#FFFFFF',
          dark: '#181A30',
        },
        surface: {
          light: '#F5F3FF',
          dark: '#1E2038',
        },
        border: {
          light: '#E9E5F7',
          dark: '#30334F',
        },
        text: {
          primary: {
            light: '#1F1937',
            dark: '#F8F7FF',
          },
          secondary: {
            light: '#6B7280',
            dark: '#A9A8BC',
          },
          muted: {
            light: '#9CA3AF',
            dark: '#77768A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 4px 0 rgba(124, 58, 237, 0.03)',
        'soft-md': '0 4px 12px 0 rgba(124, 58, 237, 0.05)',
        'soft-lg': '0 10px 25px -5px rgba(124, 58, 237, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 20px -5px rgba(124, 58, 237, 0.4)',
      }
    },
  },
  plugins: [],
}

