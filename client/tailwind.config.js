/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'polygon-image': "url('/img/login-background.jpg')",
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
