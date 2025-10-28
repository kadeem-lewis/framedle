import {
  pgTable,
  text,
  integer,
  date,
  jsonb,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

export const daily = pgTable(
  "daily",
  {
    date: date("date").notNull(),
    readableDate: text("readableDate").notNull(),
    day: integer("day").notNull(),
    mode: text("mode").notNull(),
    puzzle: jsonb("puzzle").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.day, table.mode] }),
    uniqueIndex("unique_date_mode").on(table.date, table.mode),
  ],
);

export type Daily = typeof daily.$inferSelect;
