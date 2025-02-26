/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        car: {
          100: "#e5e6f5",
          200: "#cccee9",
          300: "#b2b5dd",
          400: "#999cc6",
          500: "#6567ad",
          600: "#5a5c9a",
          700: "#4e5086",
          800: "#434573",
          900: "#37395f",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
