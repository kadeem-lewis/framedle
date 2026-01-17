import Dexie from "dexie";
import type { EntityTable } from "dexie";
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

export type GridDailyData = DailyDataBase & {
  mode: "grid";
  puzzle: {
    rows: [string, string, string];
    columns: [string, string, string];
  };
};

export type DailyData = ClassicDailyData | AbilityDailyData | GridDailyData;

export type ProgressDataBase = {
  date: string;
  day: number;
  attempts: number;
  state?: GameStatusType;
};

export type ClassicProgressData = ProgressDataBase & {
  mode: "classic";
  guessedItems: WarframeName[];
};

export type AbilityProgressData = ProgressDataBase & {
  mode: "ability";
  guessedItems: WarframeName[];
  selectedMinigameAbility: string;
};

export type GridProgressData = ProgressDataBase & {
  mode: "grid";
  gridState: Record<string, GridCell>;
  hasSeenPopup?: boolean;
};

export type ProgressData =
  | ClassicProgressData
  | AbilityProgressData
  | GridProgressData;

export type FullClassicData = ClassicDailyData &
  Omit<ClassicProgressData, "date" | "day" | "mode">;

export type FullAbilityData = AbilityDailyData &
  Omit<AbilityProgressData, "date" | "day" | "mode">;

export type FullGridData = GridDailyData &
  Omit<GridProgressData, "date" | "day" | "mode">;

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
  progress: EntityTable<ProgressData>;
};

db.version(1).stores({
  dailies: "&[day+mode], &[date+mode], mode",
  progress: "&[day+mode], &[date+mode],[state+mode], mode",
});
