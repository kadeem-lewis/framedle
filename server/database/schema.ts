import { pgTable, text, integer, date, serial } from "drizzle-orm/pg-core";

export const daily = pgTable("daily", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  day: integer("day").notNull().unique(),
  classicId: text("classicId").notNull(),
  abilityId: text("abilityId").notNull(),
});

//TODO: consider adding totalGuesses and average attempts to daily table in the future
