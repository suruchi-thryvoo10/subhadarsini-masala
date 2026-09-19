/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spice: {
          red: '#8B261D',
          'red-dark': '#6E1B13',
          saffron: '#E06D27',
          turmeric: '#E5A93C',
          beige: '#F5EFEB',
          cream: '#FAF6EE',
          brown: '#2C1810',
          dark: '#1A0E0A'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
