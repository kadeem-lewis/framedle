import * as schema from "#shared/schemas/db";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
export { sql, eq, and, or } from "drizzle-orm";

const { databaseUrl } = useRuntimeConfig();

const client = postgres(databaseUrl);

export const tables = schema;

export function useDrizzle() {
  return drizzle({ client, schema });
}
