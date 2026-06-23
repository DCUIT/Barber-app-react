/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gold: '#c5a059',
        accent: '#8b0000',
        dark: { bg: '#1a1a2e', card: '#16213e', surface: '#0f3460' },
      },
    },
  },
  plugins: [],
};
