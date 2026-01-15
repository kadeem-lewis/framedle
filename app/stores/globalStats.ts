export const useGlobalStatsStore = defineStore("global-stats", () => {
  const { mode, isDailyMode } = useGameMode();
  const { currentDailyDate, currentDailyGridData } =
    storeToRefs(useDailiesStore());
  const statsQuery = computed(() => {
    if (!mode.value || !isDailyMode(mode.value)) return;

    const date = currentDailyDate.value[mode.value];
    return {
      date,
    };
  });

  async function syncRarities() {
    const validGuesses = Object.fromEntries(
      Object.entries(currentDailyGridData.value?.gridState || {})
        .filter(([_, cell]) => cell && cell.value)
        .map(([key, value]) => [key, value.value]),
    );

    const rarities = await $fetch("/api/grid/rarity", {
      method: "POST",
      body: {
        date: statsQuery.value?.date,
        gridSubmissions: validGuesses,
      },
    });

    await db.transaction("rw", "progress", async () => {
      const progress = await db.progress.get({
        date: statsQuery.value?.date,
        mode: "grid",
      });
      if (progress && progress.gridState) {
        const nextGridState = { ...progress.gridState };
        let hasChanges = false;
        for (const [coord, rarity] of Object.entries(rarities.results)) {
          if (nextGridState[coord] && nextGridState[coord].rarity !== rarity) {
            nextGridState[coord].rarity = rarity;
            hasChanges = true;
          }
        }
        if (hasChanges) {
          await db.progress.put({
            ...progress,
            gridState: nextGridState,
          });
        }
      }
    });
  }

  const userHasMadeGuess = computed(() => {
    if (!currentDailyGridData.value?.gridState) return false;
    return Object.values(currentDailyGridData.value.gridState).some(
      (cell) => cell && cell.value,
    );
  });

  const { data, status, refresh, pending } = useFetch("/api/stats", {
    query: statsQuery,
    key: computed(() => `puzzle-stats-${statsQuery.value?.date}`),
    lazy: true,
    immediate: !!statsQuery.value,
  });

  const { isGameOver } = storeToRefs(useGameStateStore());

  watch(isGameOver, (newIsGameOver) => {
    if (newIsGameOver && statsQuery.value) {
      refresh();
    }
  });

  watch(statsQuery, (newQuery) => {
    if (newQuery) {
      console.log("Stats query changed, refreshing stats,", newQuery);
    }
  });

  const visibility = useDocumentVisibility();

  const { pause, resume } = useIntervalFn(
    async () => {
      refresh();
    },
    1000 * 60 * 2,
  ); // every 2 minutes

  watch(visibility, (newVisibility) => {
    if (newVisibility === "visible" && statsQuery.value) {
      resume();
    } else {
      pause();
    }
  });

  watch(data, (newData, oldData) => {
    if (
      newData?.grid.guessStats.totalGuesses !==
        oldData?.grid.guessStats.totalGuesses &&
      userHasMadeGuess.value
    ) {
      syncRarities();
    }
  });

  return {
    stats: data,
    refresh,
    pending,
    status,
  };
});
