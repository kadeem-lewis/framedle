import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": ["Noto Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
        },
        border: {
          success: "hsl(var(--border-success))",
          error: "hsl(var(--border-error))",
        },
      },
    },
  },
  plugins: [],
};
