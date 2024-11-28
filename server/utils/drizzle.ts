import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../database/schema";
import { createClient } from "@libsql/client";
export { sql, eq, and, or } from "drizzle-orm";

const { turso } = useRuntimeConfig();

export const db = createClient({
  url: turso.databaseUrl,
  authToken: turso.authToken,
});

export const tables = schema;

export function useDrizzle() {
  return drizzle(db, { schema });
}

export type Daily = typeof schema.daily.$inferSelect;
