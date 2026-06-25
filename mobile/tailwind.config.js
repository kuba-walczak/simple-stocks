/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(0 0% 20%)',
        input: 'hsl(0 0% 18%)',
        ring: 'hsl(142.4 71.8% 29.2%)',
        background: 'hsl(0 0% 10%)',
        foreground: 'hsl(0 0% 95%)',
        primary: {
          DEFAULT: 'hsl(142.4 71.8% 29.2%)',
          foreground: 'hsl(144.9 80.4% 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(0 0% 18%)',
          foreground: 'hsl(0 0% 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 62.8% 30.6%)',
          foreground: 'hsl(0 85.7% 97.3%)',
        },
        muted: {
          DEFAULT: 'hsl(0 0% 18%)',
          foreground: 'hsl(0 0% 65%)',
        },
        accent: {
          DEFAULT: 'hsl(0 0% 18%)',
          foreground: 'hsl(0 0% 98%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 15%)',
          foreground: 'hsl(0 0% 95%)',
        },
      },
    },
  },
  plugins: [],
};
