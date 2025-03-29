// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-02-24",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
    "nuxt-security",
    "@nuxt/test-utils",
    "@nuxt/scripts",
  ],
  runtimeConfig: {
    turso: {
      databaseUrl: "",
      authToken: "",
    },
    databaseUrl: "",
    public: {
      scripts: {
        umamiAnalytics: {
          websiteId: "",
        },
      },
      discordInvite: "",
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/classic": { ssr: false },
    "/ability": { ssr: false },
  },
  css: ["~/assets/css/main.css"],
  ui: {
    theme: {
      colors: [
        "discord",
        "bluesky",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },
  scripts: {
    registry: {
      umamiAnalytics: true,
    },
  },
  $development: {
    scripts: {
      registry: {
        umamiAnalytics: "mock",
      },
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
    ],
    defaultLocale: "en",
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
  fonts: {
    defaults: {
      weights: ["400", "500", "600", "700"],
      subsets: ["latin", "latin-ext"],
    },
    families: [
      {
        name: "Noto Sans",
        provider: "fontsource",
      },
      {
        name: "Roboto",
        provider: "fontsource",
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
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "0 0 * * *": ["add-daily"],
    },
  },
});
