/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        primary: '#00f2ff',
        secondary: '#7000ff',
        accent: '#ff00c8',
        surface: '#16161a',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary"), 0 0 20px theme("colors.primary")',
        'neon-purple': '0 0 5px theme("colors.secondary"), 0 0 20px theme("colors.secondary")',
      }
    },
  },
  plugins: [],
}
