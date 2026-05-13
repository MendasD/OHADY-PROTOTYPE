/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3C5E',
          light: '#234E7A',
          dark: '#122B43',
          50: '#E8EFF6',
          100: '#C5D5E8',
          200: '#9DBAD9',
        },
        secondary: {
          DEFAULT: '#2980B9',
          light: '#3498DB',
          dark: '#1F6797',
        },
        accent: {
          DEFAULT: '#E67E22',
          light: '#F39C12',
          dark: '#CA6F1E',
        },
        success: { DEFAULT: '#27AE60', light: '#2ECC71', dark: '#1E8449' },
        danger:  { DEFAULT: '#E74C3C', light: '#EC7063', dark: '#CB4335' },
        warning: { DEFAULT: '#F39C12', light: '#F5B041', dark: '#D68910' },
        neutral: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
          400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
          800: '#1E293B', 900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        sidebar: '2px 0 12px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
