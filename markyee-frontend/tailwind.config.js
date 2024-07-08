/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
   theme: {
    extend: {
        screens:{
            'l':'850px',
          },
        colors: {
            primary: '#0866FF'
          },
        fontFamily:{
            nunito: ['Nunito']
        },
        fontSize:{
            'md':'1rem'
        }
    },
  },
  },
  plugins: [],
}

