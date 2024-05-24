import withMT from "@material-tailwind/html/utils/withMT.js";

/** @type {import('tailwindcss').Config} */
export default withMT({
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,html,css}",
  ],
  theme: {
    extend: {

    },
  },
    plugins: [],

})