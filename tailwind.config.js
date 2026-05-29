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
          50: '#f0faf5',
          100: '#dcf0e5',
          200: '#badac6',
          300: '#8dc0a4',
          400: '#5ea37d',
          500: '#48a274', // Primary Sage Green
          600: '#39825b',
          700: '#2d6648',
          800: '#224e36',
          900: '#1c3e2b',
          950: '#0f2217',
        },
        accent: {
          50: '#fefefa',
          100: '#fdfbf2',
          500: '#ffd166', // Turnip Gold
          600: '#f2b838',
          700: '#d39620',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 12px 40px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      },
    },
  },
  plugins: [],
}
