// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-08-20",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
  ],
  runtimeConfig: {
    public: {
      posthogPublicKey: "phc_6yOpFUMQqw2woP2QvGscMvAyyADVP0rHSLYvCFc32TW",
      posthogHost: "https://us.i.posthog.com",
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  experimental: {
    typedPages: true,
  },
  colorMode: {
    preference: "system",
  },
  image: {
    domains: ["cdn.warframestat.us"],
  },
});
