/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0FDF4',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#74C69D',
          400: '#52B788',
          500: '#2D6A4F',   // brand primary
          600: '#1B4332',   // brand dark
          700: '#14532D',
          800: '#166534',
          900: '#14532D',
        },
        earth: {
          50:  '#F8F0E3',
          500: '#8B5E3C',
          700: '#6B4423',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        modal: '0 25px 60px rgba(0,0,0,0.25)',
        lg:    '0 10px 40px rgba(0,0,0,0.12)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease forwards',
        'fade-in':  'fadeIn  0.2s ease forwards',
      },
    },
  },
  plugins: [],
};
