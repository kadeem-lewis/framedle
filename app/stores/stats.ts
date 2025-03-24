import { format, startOfDay, startOfYesterday } from "date-fns";

export type FixedGuessArray = [number, number, number, number, number, number];

export const useStatsStore = defineStore(
  "stats",
  () => {
    const getDefaultStats = () => ({
      classic: {
        plays: 0,
        wins: 0,
        guesses: [0, 0, 0, 0, 0, 0] as FixedGuessArray,
        streak: 0,
        maxStreak: 0,
        lastCorrectDate: null as string | null,
        lastPlayedDate: null as string | null,
      },
      ability: {
        plays: 0,
        wins: 0,
        guesses: [0, 0, 0, 0, 0, 0] as FixedGuessArray,
        streak: 0,
        maxStreak: 0,
        lastCorrectDate: null as string | null,
        lastPlayedDate: null as string | null,
      },
    });
    const stats = ref(getDefaultStats());

    type Stats = (typeof stats.value)[keyof typeof stats.value];

    const { attempts, currentDailyDate } = storeToRefs(useGameStore());
    const { defaultAttempts } = useGameStore();

    const { hasWon, isGameOver } = useGameState();
    const mode = useGameMode();

    function resetStreak(mode: "classic" | "ability") {
      const lastPlayedDate = stats.value[mode].lastPlayedDate;

      const today = format(startOfDay(new Date()), "yyyy-MM-dd");
      const yesterday = format(startOfYesterday(), "yyyy-MM-dd");

      if (lastPlayedDate !== today && lastPlayedDate !== yesterday) {
        stats.value[mode].streak = 0;
      }
    }

    function updateStatsOnGameOver() {
      if (!mode.value || !(mode.value in stats.value)) return;

      const gameMode = mode.value as keyof typeof stats.value;
      const today = format(startOfDay(new Date()), "yyyy-MM-dd");

      if (
        currentDailyDate.value !== today ||
        !isGameOver.value[gameMode] ||
        stats.value[gameMode].lastPlayedDate === today
      ) {
        return;
      }
      const currentStats = stats.value[gameMode];

      currentStats.plays++;
      currentStats.lastPlayedDate = today;

      if (!hasWon.value) {
        currentStats.streak = 0;
        return;
      }

      currentStats.wins++;
      const attemptsUsed = defaultAttempts - attempts.value[mode.value];
      // @ts-expect-error I need to figure out how to properly type this fixed length array to prevent such as error
      currentStats.guesses[attemptsUsed - 1]++;

      updateStreak(currentStats, today);
    }

    function updateStreak(stats: Stats, today: string) {
      if (!stats.lastCorrectDate) {
        stats.streak = 1;
      } else {
        const yesterday = format(startOfYesterday(), "yyyy-MM-dd");
        stats.streak =
          stats.lastCorrectDate === yesterday ? stats.streak + 1 : 1;
      }

      stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
      stats.lastCorrectDate = today;
    }

    function resetStats() {
      stats.value = getDefaultStats();
      console.log(stats.value);
    }

    return {
      stats,
      resetStreak,
      updateStatsOnGameOver,
      updateStreak,
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
