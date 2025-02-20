/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#191919',
          light: '#232323',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#AAD3FF',
          light: '#D6E9FF',
          dark: '#7AB8FF',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        error: {
          DEFAULT: '#F44336',
          light: '#FF8A80',
          dark: '#B71C1C',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        info: {
          DEFAULT: '#2196F3',
          light: '#BBDEFB',
          dark: '#0D47A1',
        },
        gray: {
          DEFAULT: '#9E9E9E',
          light: '#E0E0E0',
          dark: '#424242',
        },
      },

      fontFamily: {
        'cairo-light': ['Cairo_300Light'],
        cairo: ['Cairo_400Regular'],
        'cairo-medium': ['Cairo_500Medium'],
        'cairo-semibold': ['Cairo_600SemiBold'],
        'cairo-bold': ['Cairo_700Bold'],
        'cairo-extrabold': ['Cairo_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
