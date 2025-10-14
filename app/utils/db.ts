import Dexie from "dexie";
import type { EntityTable } from "dexie";
import type { GameStatusType } from "#imports";

export type DailyData =
  | {
      day: number;
      mode: "classic";
      date: string;
      guessedItems: WarframeName[];
      attempts: number;
      itemToGuess: WarframeName;
      state?: GameStatusType;
    }
  | {
      day: number;
      mode: "ability";
      date: string;
      guessedItems: WarframeName[];
      attempts: number;
      itemToGuess: Ability;
      state?: GameStatusType;
    };

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
};

db.version(1).stores({
  dailies: "&[mode+day], &[mode+date]",
});
