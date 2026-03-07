// prettier.config.js

/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/assets/css/main.css",
  tailwindFunctions: ["ui"],
};

export default config;
