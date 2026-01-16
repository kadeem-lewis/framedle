export const useGlobalStatsStore = defineStore("global-stats", () => {
  const { mode, isDailyMode } = useGameMode();
  const { currentDailyDate, currentDailyGridData } =
    storeToRefs(useDailiesStore());
  const { isGameOver } = storeToRefs(useGameStateStore());

  const statsQuery = computed(() => {
    if (!mode.value || !isDailyMode(mode.value)) return;

    const date = currentDailyDate.value[mode.value];
    return {
      date,
      showAnswers: !!(mode.value === "grid" && isGameOver.value),
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

  //TODO: i need to prevent the code from running in unlimited mode
  const { data, status, refresh, pending } = useFetch("/api/stats", {
    query: statsQuery,
    key: computed(
      () =>
        `puzzle-stats-${statsQuery.value?.date}-${statsQuery.value?.showAnswers}`,
    ),
    lazy: true,
    immediate: false,
    watch: false,
  });

  watch(isGameOver, (newIsGameOver) => {
    if (newIsGameOver && statsQuery.value) {
      refresh();
    }
  });

  watchDebounced(
    statsQuery,
    (newQuery) => {
      if (newQuery) {
        // using a debounced to prevent multiple fetch requests since statsQuery can change rapidly
        refresh();
      }
    },
    { immediate: true, deep: true, debounce: 50 },
  );

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
