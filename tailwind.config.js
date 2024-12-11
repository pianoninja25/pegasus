/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        inherit: 'inherit',
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
      },
      fontFamily: {
        'roboto': ['Roboto', 'serif'],
        'montserrat': ['Montserrat', 'serif'],
        'quicksand': ['Quicksand', 'serif']
      },
      colors: {
        amtblue: '#152c57',
        amtorange: '#f58220',
        amtgrey: '#a4a3a4',
        amtred: '#ff0000',
      },
      boxShadow: {
        whiteMd: '0 2px 4px 2px rgba(255, 255, 255, .1), 0 2px 4px 6px rgba(0, 0, 0, .2)',
      },
      animation: {
        slowBounce: 'bounce 4s infinite',
      },
    },
  },
  plugins: [],
};
