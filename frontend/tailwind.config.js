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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36a9f7',
          500: '#0c8de9',
          600: '#006fc7',
          700: '#0059a3',
          800: '#054b85',
          900: '#0a3f6f',
          950: '#06284a',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        card: {
          light: '#f8fafc',
          dark: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 20px -5px rgba(12, 141, 233, 0.4)',
      }
    },
  },
  plugins: [],
}
