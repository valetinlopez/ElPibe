/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Superficies
        'bg-base': '#0B0E14',
        'bg-surface': '#12161F',
        'bg-surface-raised': '#1A1F2B',
        'bg-surface-overlay': '#20262F',

        // Bordes
        'border-subtle': '#272E3A',
        'border-default': '#343C4A',

        // Acento azul
        'accent-blue': '#2D6FE0',
        'accent-blue-bright': '#4C8DFF',
        'accent-blue-metal': '#3A5A8C',
        'accent-blue-dim': '#1C3A66',

        // Acentos secundarios
        'accent-sky': '#75AADB',
        'accent-gold': '#D4AF37',
        'accent-red': '#E5484D',
        'accent-yellow': '#F2C94C',
        'accent-green': '#3FB873',

        // Texto
        'text-primary': '#F4F5F7',
        'text-secondary': '#A8AFBD',
        'text-tertiary': '#6B7280',
        'text-on-accent': '#FFFFFF',
        'text-link': '#4C8DFF',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '999px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
      fontFamily: {
        'display': ['WinnerCondensedMedium', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrainsMono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['40px', { lineHeight: '44px', fontWeight: '700' }],
        'display-lg': ['32px', { lineHeight: '36px', fontWeight: '700' }],
        'display-md': ['24px', { lineHeight: '28px', fontWeight: '700' }],
        'heading-lg': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'heading-md': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '22px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '14px', fontWeight: '500' }],
        'button-text': ['15px', { lineHeight: '20px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
