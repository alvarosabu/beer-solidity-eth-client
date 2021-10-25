const colors = require('windicss/colors')
const plugin = require('windicss/plugin')
const defaultTheme = require('windicss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.ts'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      red: colors.red,
      lime: colors.lime,
      green: colors.green,
      blue: colors.blue,
      orange: colors.orange,
      yellow: colors.yellow,
      primary: {
        // oxford
        DEFAULT: '#3E5166',
        50: '#B7C4D3',
        100: '#A7B7C9',
        200: '#879DB6',
        300: '#6784A3',
        400: '#516A86',
        500: '#3E5166',
        600: '#2B3846',
        700: '#171F27',
        800: '#040507',
        900: '#000000',
      },
      secondary: {
        // caribbean-green
        DEFAULT: '#34D399',
        50: '#F1FCF8',
        100: '#DCF7ED',
        200: '#B2EED8',
        300: '#88E5C3',
        400: '#5EDCAE',
        500: '#34D399',
        600: '#26AE7C',
        700: '#1D845F',
        800: '#145A41',
        900: '#0B3023',
      },
      tertiary: {
        // mango-tango
        DEFAULT: '#FD813E',
        50: '#FFFFFF',
        100: '#FFFFFF',
        200: '#FFE4D5',
        300: '#FEC3A3',
        400: '#FEA270',
        500: '#FD813E',
        600: '#FC600C',
        700: '#D34B02',
        800: '#A03902',
        900: '#6E2701',
      },
      warning: {
        // maiz yellow
        DEFAULT: '#F0C64C',
        50: '#FFFFFF',
        100: '#FFFFFF',
        200: '#FCF3D9',
        300: '#F8E4AA',
        400: '#F4D57B',
        500: '#F0C64C',
        600: '#ECB71D',
        700: '#C59711',
        800: '#96730D',
        900: '#674F09',
      },
    },

    fontFamily: {
      sans: ['Nunito', 'system-ui', 'sans-serif'],
      display: ['Gilroy', 'Georgia', 'serif'],
      mono: ['FiraCode', 'ui-monospace'],
      typewrite: ['iA Writer Duo S', 'Georgia', 'serif'],
    },

    screens: {
      xs: '320px',
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      boxShadow: ['active', 'dark'],
      opacity: ['disabled'],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.aspect-none': {
          aspectRatio: 'none',
        },
        '.aspect-16-9': {
          aspectRatio: '16/9',
        },
        '.aspect-4-3': {
          aspectRatio: '4/3',
        },
        '.aspect-1-1': {
          aspectRatio: '1/1',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }),
  ],
}
