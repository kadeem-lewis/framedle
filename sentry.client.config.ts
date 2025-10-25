import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://fb7ff6ba8a0cda589d2881b274a8743b@o4508153642876928.ingest.us.sentry.io/4509149554606080",
  enabled: process.env.NODE_ENV === "production",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
