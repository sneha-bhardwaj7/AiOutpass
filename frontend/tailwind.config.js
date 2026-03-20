/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          50: "#FDF1FA",
          100: "#FAE1F3",
          200: "#F5C3E7",
          300: "#F0A5DB",
          400: "#C45AA3",
          500: "#A23B88",
          600: "#8E2A7A",
          700: "#7B1E6D",
          800: "#5C1552",
          900: "#3D0D38",
        },
        white: {
          50: "#FFFFFF",
          100: "#F9F7FF",
          200: "#F3F0FF",
          300: "#EDEBFF",
        },
      },
    },
  },
  plugins: [],
}