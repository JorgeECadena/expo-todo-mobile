import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/App.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;