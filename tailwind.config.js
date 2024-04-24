/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/native")

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [nativewind()],
}