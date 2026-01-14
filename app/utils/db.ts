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

export type ProgressData = {
  date: string;
  day: number;
  attempts: number;
  state?: GameStatusType;
  guessedItems?: WarframeName[];
  selectedMinigameAbility?: string;
  gridState?: Record<string, GridCell>;
  hasSeenPopup?: boolean;
} & (
  | { mode: "classic"; guessedItems: WarframeName[] }
  | {
      mode: "ability";
      selectedMinigameAbility: string;
      guessedItems: WarframeName[];
    }
  | {
      mode: "grid";
      gridState: Record<string, GridCell>;
      hasSeenPopup?: boolean;
    }
);

export type FullClassicData = ClassicDailyData &
  Omit<ProgressData, "date" | "day" | "mode">;

export type FullAbilityData = AbilityDailyData &
  Omit<ProgressData, "date" | "day" | "mode"> & {
    selectedMinigameAbility: string;
  };

export type FullGridData = GridDailyData &
  Omit<ProgressData, "date" | "day" | "mode"> & {
    gridState: Record<string, GridCell>;
  };

export const db = new Dexie("framedle") as Dexie & {
  dailies: EntityTable<DailyData>;
  progress: EntityTable<ProgressData>;
};

db.version(1).stores({
  dailies: "&[day+mode], &[date+mode], mode",
  progress: "&[day+mode], &[date+mode],[state+mode], mode",
});
