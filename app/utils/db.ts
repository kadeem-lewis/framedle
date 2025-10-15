import Dexie from "dexie";
import type { EntityTable } from "dexie";
import type { GameStatusType } from "#imports";

type DailyDataBase = {
  day: number;
  date: string;
  attempts: number;
  state?: GameStatusType;
  guessedItems: WarframeName[];
  selectedMinigameAbility?: string;
};

export type ClassicDailyData = DailyDataBase & {
  mode: "classic";
  itemToGuess: WarframeName;
};

export type AbilityDailyData = DailyDataBase & {
  mode: "ability";
  itemToGuess: Ability;
  selectedMinigameAbility: string;
};

export type DailyData = ClassicDailyData | AbilityDailyData;

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
};

db.version(1).stores({
  dailies: "&[day+mode], &[date+mode]",
});
