/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f2744',
          dark: '#0b1a2e',
          light: '#163356',
        },
        navy: {
          900: '#0b1a2e',
          800: '#0f2744',
          700: '#163356',
          600: '#1d4470',
        },
        secondary: '#64748b',
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#eff6ff',
          cyan: '#38bdf8',
        },
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        background: '#f4f6fa',
      },
      fontFamily: {
        sans: ['Manrope', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}