/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8', // Pastel pink 50
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ff85a2', // Cute Pastel Pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#7dd3fc', // Pastel Blue
          600: '#38bdf8',
          700: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(255, 133, 162, 0.1)',
        'premium-hover': '0 12px 40px rgba(255, 133, 162, 0.2)',
        'glass': '0 8px 32px 0 rgba(125, 211, 252, 0.15)',
      },
    },
  },
  plugins: [],
}
