import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const daily = sqliteTable("daily", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  day: integer("day").notNull().unique(),
  classicId: integer("classicId").notNull(),
  abilityId: integer("abilityId").notNull(),
});
