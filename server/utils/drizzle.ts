import * as schema from "../database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
export { sql, eq, and, or } from "drizzle-orm";

const { databaseUrl } = useRuntimeConfig();

const sql = neon(databaseUrl);

export const tables = schema;

export function useDrizzle() {
  return drizzle({ client: sql, schema });
}

export type Daily = typeof schema.daily.$inferSelect;
