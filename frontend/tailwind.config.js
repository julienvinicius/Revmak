/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9e6',
          100: '#ffedb8',
          200: '#ffe28a',
          300: '#ffd75c',
          400: '#ffcc2e',
          500: '#ffc000', // Cor principal
          600: '#cc9a00',
          700: '#997300',
          800: '#664d00',
          900: '#332600',
        },
        brown: {
          50: '#f8f3f0',
          100: '#e8dcd3',
          200: '#d7c5b7',
          300: '#c6ae9a',
          400: '#b5977e',
          500: '#a48062',
          600: '#8c6a4f',
          700: '#74553d',
          800: '#5d402a', // Marrom escuro principal
          900: '#452b18',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      backgroundImage: {
        'restaurant-pattern': "url('/images/restaurante.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.2)',
        lg: '0 2px 10px rgba(0, 0, 0, 0.5)',
      },
      boxShadow: {
        '3d': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        'inner-3d': 'inset 0 2px 10px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      rotate: {
        'y-6': 'rotateY(6deg)',
      },
      perspective: {
        'none': '0',
        '500': '500px',
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.rotate-y-6': {
          transform: 'rotateY(6deg)',
        },
        '.perspective-500': {
          perspective: '500px',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

