/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f8f4',
          100: '#e8efe2',
          200: '#d1dfc6',
          300: '#a8c597',
          400: '#7da46a',
          500: '#5d864c',
          600: '#476a39',
          700: '#39542f',
          800: '#2f4427',
          900: '#283821'
        },
        cream: {
          50: '#fdfaf4',
          100: '#faf3e6',
          200: '#f3e4c4',
          300: '#ead0a0'
        },
        tangerine: {
          400: '#ff9a55',
          500: '#f97316',
          600: '#e0610d'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
