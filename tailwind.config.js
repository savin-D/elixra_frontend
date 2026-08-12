/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        elira: {
          black: '#0a0a0a',
          dark: '#111111',
          gray: '#888888',
          light: '#f5f5f5',
          white: '#ffffff',
          accent: '#2563eb',
        }
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
      }
    },
  },
  plugins: [],
}
