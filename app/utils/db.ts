import Dexie from "dexie";
import type { EntityTable } from "dexie";
import type { GameStatusType } from "#imports";
import type { Daily } from "#shared/schemas/db";

export type DailyData = Omit<Daily, "puzzle">;

export type ProgressDataBase = {
  date: string;
  day: number;
  attempts: number;
  guessedItems: WarframeName[];
  state?: GameStatusType;
  selectedMinigameAbility?: string;
};

export type ClassicProgressData = ProgressDataBase & {
  mode: "classic";
  itemToGuess: WarframeName;
};

export type AbilityProgressData = ProgressDataBase & {
  mode: "ability";
  itemToGuess: Ability;
  selectedMinigameAbility: string;
};

export type ProgressData = ClassicProgressData | AbilityProgressData;

export type ClassicDailyData = DailyData &
  Omit<ClassicProgressData, "date" | "day" | "mode">;

export type AbilityDailyData = DailyData &
  Omit<AbilityProgressData, "date" | "day" | "mode">;

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
  progress: EntityTable<ProgressData>;
};

db.version(1).stores({
  dailies: "&[day+mode], &[date+mode], mode",
  progress: "&[day+mode], &[date+mode], mode",
});
