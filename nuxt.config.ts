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
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
  ],
  runtimeConfig: {
    public: {
      posthogPublicKey: "phc_6yOpFUMQqw2woP2QvGscMvAyyADVP0rHSLYvCFc32TW",
      posthogHost: "https://us.i.posthog.com",
    },
  },
  routeRules: {
    "/classic": { ssr: false },
    "/ability": { ssr: false },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  site: {
    url: "https://framedle.com",
    name: "Framedle",
    description: "Daily guessing games for Warframe.",
  },
  i18n: {
    strategy: "no_prefix",
    vueI18n: "./i18n.config.ts",
    locales: [
      { code: "en", language: "", name: "English" },
      {
        code: "es",
        language: "",
        name: "Español",
      },
      { code: "pt", language: "", name: "Português" },
    ],
    defaultLocale: "en",
    baseUrl: "https://framedle.com",
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

  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "0 23 * * *": ["add-daily"],
    },
  },
});
