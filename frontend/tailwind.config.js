import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Ye sabse important line hai
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          500: '#eab308',
        }
      },
    },
  },
  plugins: [],
};
export default config;