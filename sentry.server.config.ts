import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://db1385d0c6f2525359235bdd20e52705@o4508153642876928.ingest.us.sentry.io/4508152577064960",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
