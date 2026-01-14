import { format, startOfDay, startOfYesterday } from "date-fns";

export type FixedGuessArray = [number, number, number, number, number, number];

type BaseStats = {
  plays: number;
  streak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
};

export type LegacyModeStats = BaseStats & {
  wins: number;
  guesses: FixedGuessArray;
  lastCorrectDate: string | null;
};

export type GridModeStats = BaseStats & {
  averageScore: number | null;
  scoreDistribution: Record<number, number>;
};

export interface StatsState {
  classic: LegacyModeStats;
  ability: LegacyModeStats;
  grid: GridModeStats;
}

export const useStatsStore = defineStore(
  "stats.v2",
  () => {
    const getToday = () => format(startOfDay(new Date()), "yyyy-MM-dd");
    const getYesterday = () => format(startOfYesterday(), "yyyy-MM-dd");

    const createDefaultGuessStats = (): LegacyModeStats => ({
      plays: 0,
      wins: 0,
      guesses: [0, 0, 0, 0, 0, 0],
      streak: 0,
      maxStreak: 0,
      lastCorrectDate: null,
      lastPlayedDate: null,
    });

    const createDefaultGridStats = (): GridModeStats => ({
      plays: 0,
      streak: 0,
      maxStreak: 0,
      lastPlayedDate: null,
      averageScore: null,
      scoreDistribution: {},
    });

    const stats = ref<StatsState>({
      classic: createDefaultGuessStats(),
      ability: createDefaultGuessStats(),
      grid: createDefaultGridStats(),
    });

    const { attempts } = storeToRefs(useGameStore());
    const { DEFAULT_ATTEMPTS } = useGameStore();

    const { hasWon, isGameOver } = storeToRefs(useGameStateStore());
    const { currentDailyDate } = storeToRefs(useDailiesStore());
    const { mode, isLegacyDailyMode } = useGameMode();
    const { gameScore } = storeToRefs(useGridGameStore());

    function calculateStreak(
      currentStreak: number,
      lastDate: string | null,
    ): number {
      return lastDate === getYesterday() ? currentStreak + 1 : 1;
    }

    function validateStreak(modeKey: keyof StatsState) {
      const currentStats = stats.value[modeKey];
      const lastDate = currentStats.lastPlayedDate;

      if (lastDate !== getToday() && lastDate !== getYesterday()) {
        currentStats.streak = 0;
      }
    }

    function updateGridStats(today: string) {
      const currentStats = stats.value.grid;
      const score = gameScore.value;

      currentStats.plays++;

      if (score > 0) {
        currentStats.streak = calculateStreak(
          currentStats.streak,
          currentStats.lastPlayedDate,
        );
        currentStats.maxStreak = Math.max(
          currentStats.maxStreak,
          currentStats.streak,
        );
      } else {
        currentStats.streak = 0;
      }

      currentStats.scoreDistribution[score] =
        (currentStats.scoreDistribution[score] ?? 0) + 1;

      const totalPlays = Object.values(currentStats.scoreDistribution).reduce(
        (a, b) => a + b,
        0,
      );
      const totalScore = Object.entries(currentStats.scoreDistribution).reduce(
        (sum, [score, count]) => sum + Number(score) * count,
        0,
      );
      currentStats.averageScore = totalPlays ? totalScore / totalPlays : null;

      currentStats.lastPlayedDate = today;
    }

    function updateLegacyStats(gameMode: "classic" | "ability", today: string) {
      const currentStats = stats.value[gameMode];

      currentStats.plays++;
      currentStats.lastPlayedDate = today;

      if (!hasWon.value) {
        currentStats.streak = 0;
        return;
      }

      currentStats.wins++;

      const attemptsUsed = DEFAULT_ATTEMPTS - attempts.value[gameMode];

      const guessIndex = attemptsUsed - 1;
      if (guessIndex >= 0 && guessIndex < currentStats.guesses.length) {
        currentStats.guesses[guessIndex]!++;
      }

      if (!currentStats.lastCorrectDate) {
        currentStats.streak = 1;
      } else {
        currentStats.streak = calculateStreak(
          currentStats.streak,
          currentStats.lastCorrectDate,
        );
      }

      currentStats.maxStreak = Math.max(
        currentStats.maxStreak,
        currentStats.streak,
      );
      currentStats.lastCorrectDate = today;
    }

    function updateStatsOnGameOver() {
      if (!mode.value || !isGameOver.value) return;

      const gameMode = mode.value;
      const today = getToday();

      const relevantDate =
        currentDailyDate.value[gameMode as keyof typeof currentDailyDate.value];

      // Only the current day can trigger a stats update, archive games do not
      if (relevantDate !== today) return;

      if (gameMode === "grid") {
        if (stats.value.grid.lastPlayedDate === today) return;
        updateGridStats(today);
      } else if (isLegacyDailyMode(gameMode)) {
        if (stats.value[gameMode].lastPlayedDate === today) return;
        updateLegacyStats(gameMode, today);
      }
    }

    function resetStats() {
      stats.value = {
        classic: createDefaultGuessStats(),
        ability: createDefaultGuessStats(),
        grid: createDefaultGridStats(),
      };
    }

    return {
      stats,
      updateStatsOnGameOver,
      validateStreak,
      resetStats,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["stats"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot));
}
