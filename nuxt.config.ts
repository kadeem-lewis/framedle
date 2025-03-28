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
    "@vite-pwa/nuxt",
  ],
  runtimeConfig: {
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
    bundle: {
      optimizeTranslationDirective: false,
    },
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
  pwa: {
    registerType: "autoUpdate",
    strategies: "generateSW",
    manifest: {
      name: "Framedle",
      short_name: "Framedle",
      description: "Daily guessing games for Warframe.",
      theme_color: "#3498db",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
        { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
    },
  },
});
