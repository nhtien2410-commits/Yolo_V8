/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#05070a',
        accentRed: '#ef4444',
        accentTeal: '#14b8a6',
      },
    },
  },
  plugins: [],
}
