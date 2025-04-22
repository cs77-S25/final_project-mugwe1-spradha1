import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    animatePlugin,
  ],
}

export default config