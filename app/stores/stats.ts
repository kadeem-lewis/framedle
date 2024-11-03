import {
  isToday,
  isYesterday,
  format,
  startOfDay,
  startOfYesterday,
} from "date-fns";

export type FixedGuessArray = [number, number, number, number, number, number];

export const useStatsStore = defineStore(
  "stats",
  () => {
    const stats = ref({
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

    const { attempts, currentDailyDate } = storeToRefs(useGameStore());
    const { defaultAttempts } = useGameStore();

    const { hasWon } = useGameState();
    const mode = useGameMode();

    function updateStreak(mode: "classic" | "ability") {
      const lastPlayedDate = stats.value[mode].lastPlayedDate;
      if (
        lastPlayedDate &&
        !isToday(lastPlayedDate) &&
        !isYesterday(lastPlayedDate)
      ) {
        stats.value[mode].streak = 0;
      }
    }

    function updateStatsOnGameOver() {
      const today = format(startOfDay(new Date()), "yyyy-MM-dd");
      if (
        (mode.value === "ability" || mode.value === "classic") &&
        currentDailyDate.value === today &&
        stats.value[mode.value].lastPlayedDate !== today
      ) {
        const currentStats = stats.value[mode.value];
        currentStats.plays++;
        currentStats.lastPlayedDate = today;

        if (hasWon.value) {
          currentStats.wins++;
          const attemptsUsed = defaultAttempts - attempts.value[mode.value];
          // @ts-expect-error I need to figure out how to properly type this fixed length array to prevent such as error
          currentStats.guesses[attemptsUsed - 1]++;
          const lastCorrectDate = currentStats.lastCorrectDate;

          if (!lastCorrectDate) {
            currentStats.streak = 1;
          } else if (
            lastCorrectDate === format(startOfYesterday(), "yyyy-MM-dd")
          ) {
            currentStats.streak++;
          } else {
            currentStats.streak = 1;
          }

          currentStats.maxStreak = Math.max(
            currentStats.maxStreak,
            currentStats.streak,
          );
          currentStats.lastCorrectDate = today;
        } else {
          currentStats.streak = 0;
        }
      }
    }

    return { stats, updateStatsOnGameOver, updateStreak };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      serializer: {
        serialize: (state) => btoa(JSON.stringify(state)),
        deserialize: (state) => JSON.parse(atob(state)),
      },
      pick: ["stats"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot));
}
