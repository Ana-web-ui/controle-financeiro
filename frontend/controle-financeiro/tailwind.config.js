/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberpink: "#ff0080",
        darkbg: "#0f0f14",
      },
    },
  },
  plugins: [],
}
