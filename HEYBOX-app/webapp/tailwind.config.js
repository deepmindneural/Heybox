module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00b8d4',
          light: '#62ebff',
          dark: '#0088a3',
        },
        secondary: {
          DEFAULT: '#424242',
          light: '#6d6d6d',
          dark: '#1b1b1b',
        },
        accent: {
          DEFAULT: '#ff6f00',
          light: '#ff9e40',
          dark: '#c43e00',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
