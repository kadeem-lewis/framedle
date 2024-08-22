import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const daily = sqliteTable("daily", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(),
  day: integer("day").notNull().unique(),
  classicId: text("classicId").notNull(),
  abilityId: text("abilityId").notNull(),
});

//TODO: consider adding totalGuesses and average attempts to daily table in the future
