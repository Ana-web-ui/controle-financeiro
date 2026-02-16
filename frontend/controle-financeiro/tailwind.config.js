/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberpink: "#ff00aa",
        darkbg: "#0a0a0f",
      },
    },
  },
  plugins: [],
}
