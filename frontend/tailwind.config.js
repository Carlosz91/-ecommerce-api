/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFEDB3',
          200: '#FFE080',
          300: '#FFD44D',
          400: '#FFC81A',
          500: '#E5B300',
          600: '#B88A00',
          700: '#8A6600',
          800: '#5C4400',
          900: '#2E2200',
        },
        bronze: {
          50: '#FDF5EF',
          100: '#F9E8D8',
          200: '#F0D1B0',
          300: '#E7BA88',
          400: '#DEA360',
          500: '#D48C38',
          600: '#B87333',
          700: '#8A5626',
          800: '#5C3919',
          900: '#2E1D0D',
        },
      },
    },
  },
  plugins: [],
}
