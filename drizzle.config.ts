import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schemas/db.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL!,
  },
});
