import dotenv from "dotenv";
import * as Sentry from "@sentry/nuxt";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_SERVER_DSN,
  // Tracing
  // We recommend adjusting this value in production, or using a tracesSampler for finer control.
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});
