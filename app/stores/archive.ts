export const useArchiveStore = defineStore(
  "archive",
  () => {
    const totalArchiveGames = ref<number | null>(null);

    const { pastDays, selectedArchiveMode } = storeToRefs(useDailiesStore());

    const inProgressDaysCount = computed(() => {
      if (!pastDays.value) return null;
      return pastDays.value.filter(
        (day) =>
          day.state === GameStatus.ACTIVE &&
          day.mode === selectedArchiveMode.value,
      ).length;
    });

    const completedDaysCount = computed(() => {
      if (!pastDays.value) return null;
      return pastDays.value.filter(
        (day) =>
          day.state &&
          day.state !== GameStatus.ACTIVE &&
          day.mode === selectedArchiveMode.value,
      ).length;
    });

    const notStartedDaysCount = computed(() => {
      if (totalArchiveGames.value === 0) return 0;
      console.log("Total Archive Games:", totalArchiveGames.value);
      // "Played" is the sum of completed and in-progress games
      const playedCount =
        (inProgressDaysCount.value ?? 0) + (completedDaysCount.value ?? 0);
      // "Not Started" is the total minus the ones already played
      const notStarted = (totalArchiveGames.value ?? 0) - playedCount;
      return notStarted > 0 ? notStarted : 0;
    });

    async function getAdjacentArchiveDays(day: number) {
      const previousDay = day - 1;
      const nextDay = day + 1;

      const [prevData, nextData] = await Promise.all([
        db.dailies.where({ day: previousDay }).first(),
        db.dailies.where({ day: nextDay }).first(),
      ]);

      return {
        previous: prevData ? prevData.day : null,
        next: nextData ? nextData.day : null,
      };
    }

    return {
      selectedArchiveMode,
      totalArchiveGames,
      inProgressDaysCount,
      completedDaysCount,
      notStartedDaysCount,
      getAdjacentArchiveDays,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: [""],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStateStore, import.meta.hot));
}
