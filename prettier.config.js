// prettier.config.js

/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/assets/css/main.css",
  tailwindAttributes: ["ui", ":ui"],
  tailwindFunctions: ["tw"],
};

export default config;
