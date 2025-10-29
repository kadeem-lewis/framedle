import {
  pgTable,
  text,
  integer,
  date,
  jsonb,
  uniqueIndex,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

const modeEnum = pgEnum("mode_enum", ["classic", "ability", "grid"]);

export const daily = pgTable(
  "daily",
  {
    date: date("date").notNull(),
    readableDate: text("readableDate").notNull(),
    day: integer("day").notNull(),
    mode: modeEnum("mode").notNull(),
    puzzle: jsonb("puzzle").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.day, table.mode] }),
    uniqueIndex("unique_date_mode").on(table.date, table.mode),
  ],
);

export type Daily = typeof daily.$inferSelect;

const queueModeEnum = pgEnum("queue_mode_enum", ["classic", "ability"]);

export const queue = pgTable("queue", {
  name: queueModeEnum("name").primaryKey(),
  data: jsonb("data").$type<DailyQueue>().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export type DatabaseQueue = typeof queue.$inferSelect;
