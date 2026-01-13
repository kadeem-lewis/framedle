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
import { relations, sql } from "drizzle-orm";

export const modeEnum = pgEnum("mode_enum", ["classic", "ability", "grid"]);

export type LegacyPuzzle = {
  answer: string;
};

export type GridPuzzle = {
  rows: [string, string, string];
  columns: [string, string, string];
};

export const daily = pgTable(
  "daily",
  {
    date: date("date").notNull(),
    readableDate: text("readableDate").notNull(),
    day: integer("day").notNull(),
    mode: modeEnum("mode").notNull(),
    puzzle: jsonb("puzzle").$type<{ answer: string } | GridPuzzle>().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.day, table.mode] }),
    uniqueIndex("unique_date_mode").on(table.date, table.mode),
  ],
);

export type Daily = typeof daily.$inferSelect;

export const queueModeEnum = pgEnum("queue_mode_enum", ["warframe", "ability"]);

export const queue = pgTable("queue", {
  name: queueModeEnum("name").primaryKey(),
  data: jsonb("data").$type<DailyQueue>().notNull(),
  updatedAt: date("updatedAt").defaultNow().notNull(),
});

export type DatabaseQueue = typeof queue.$inferSelect;

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  lastUsed: date("lastUsed").default(sql`NULL`),
  key: text("key").notNull(),
  warframes: text("warframes").array().notNull(),
});

export type Category = typeof categories.$inferSelect;

export type ValidWarframeData = {
  name: string;
  guessCount: number;
};

export const categoryPairs = pgTable(
  "category_pairs",
  {
    categoryA: text("categoryA")
      .references(() => categories.id)
      .notNull(),
    categoryB: text("categoryB")
      .references(() => categories.id)
      .notNull(),
    lastUsed: date("lastUsed").default(sql`NULL`),
    totalGuesses: integer("totalGuesses").default(0).notNull(),
    validWarframes: jsonb("validWarframes")
      .$type<ValidWarframeData[]>()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.categoryA, table.categoryB] })],
);

export type CategoryPair = typeof categoryPairs.$inferSelect;

export const categoryPairsRelations = relations(categoryPairs, ({ one }) => ({
  catA: one(categories, {
    fields: [categoryPairs.categoryA],
    references: [categories.id],
    relationName: "catA",
  }),
  catB: one(categories, {
    fields: [categoryPairs.categoryB],
    references: [categories.id],
    relationName: "catB",
  }),
}));
