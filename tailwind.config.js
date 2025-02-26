/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['font-inter', 'sans-serif'],
      },
      colors:{
        'dark-blue' : '#081028',
        'light-dark-blue' : '#0B1739',
        'blue-grey' : '#7E89AC',
        'side-bar' : '#0A1330'

      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [],
  },
  // daisyui: {
  //   themes: ["light", "dark", "cupcake"],
  // },
}

