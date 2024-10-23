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
    "nuxt-security",
    "@sentry/nuxt/module",
  ],
  runtimeConfig: {
    public: {
      posthogPublicKey: "phc_6yOpFUMQqw2woP2QvGscMvAyyADVP0rHSLYvCFc32TW",
      posthogHost: "https://us.i.posthog.com",
      sentry: {
        dsn: "",
      },
      discordInvite: "",
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
  schemaOrg: {
    identity: "Organization",
  },
  i18n: {
    strategy: "no_prefix",
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "en",
      alwaysRedirect: true,
      redirectOn: "root",
      cookieSecure: true,
    },
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      {
        code: "es",
        language: "es-ES",
        name: "Español",
        file: "es.json",
      },
      { code: "pt", language: "pt-BR", name: "Português", file: "pt.json" },
    ],
    defaultLocale: "en",
    langDir: "lang",
    lazy: true,
    baseUrl: "https://framedle.com",
  },
  icon: {
    provider: "server",
    customCollections: [
      {
        prefix: "my-icon",
        dir: "./app/assets/svgs",
      },
    ],
  },
  sourcemap: { client: true },
  experimental: {
    typedPages: true,
  },
  colorMode: {
    preference: "system",
  },
  image: {
    domains: ["cdn.warframestat.us"],
  },
  sentry: {
    sourceMapsUploadOptions: {
      org: "framedle",
      project: "framedle",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    dynamicImportForServerEntry: false,
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
