/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: "#fdf2f5",
          100: "#fbe6eb",
          200: "#f5c0cd",
          300: "#ef9ab0",
          400: "#d45a7a",
          500: "#800020",
          600: "#660019",
          700: "#4d0013",
          800: "#33000d",
        },
        cream: {
          50: "#FFFCF5",
          100: "#FAF5EB",
          200: "#F5ECD6",
          300: "#E8D7B8",
          400: "#DCC6A0",
        },
      },
    },
  },
  plugins: [],
}