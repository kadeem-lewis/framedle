import Dexie from "dexie";
import type { EntityTable } from "dexie";
import type { GameStatusType } from "#imports";
import type { Daily } from "#shared/schemas/db";

export type DailyDataBase = Omit<Daily, "puzzle">;

export type ClassicDailyData = DailyDataBase & {
  mode: "classic";
  itemToGuess: WarframeName;
};

export type AbilityDailyData = DailyDataBase & {
  mode: "ability";
  itemToGuess: Ability;
};

export type DailyData = ClassicDailyData | AbilityDailyData;

export type ProgressData = {
  date: string;
  day: number;
  mode: "classic" | "ability";
  attempts: number;
  guessedItems: WarframeName[];
  state?: GameStatusType;
  selectedMinigameAbility?: string;
};

export type FullClassicData = DailyData &
  Omit<ProgressData, "date" | "day" | "mode">;

export type FullAbilityData = DailyData &
  Omit<ProgressData, "date" | "day" | "mode">;

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
  progress: EntityTable<ProgressData>;
};

db.version(1).stores({
  dailies: "&[day+mode], &[date+mode], mode",
  progress: "&[day+mode], &[date+mode],[state+mode], mode",
});
