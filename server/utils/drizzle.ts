import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../database/schema";
import { createClient } from "@libsql/client";
export { sql, eq, and, or } from "drizzle-orm";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const tables = schema;

export function useDrizzle() {
  return drizzle(db, { schema });
}

export type Daily = typeof schema.daily.$inferSelect;
