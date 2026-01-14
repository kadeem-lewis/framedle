import { format } from "date-fns";

export const useGlobalStatsStore = defineStore("global-stats", () => {
  const { mode, isDailyMode } = useGameMode();
  const { currentDailyDate, currentDailyGridData } =
    storeToRefs(useDailiesStore());
  const statsQuery = computed(() => {
    if (!mode.value || !isDailyMode(mode.value))
      throw createError("Mode is undefined");

    const date =
      currentDailyDate.value[mode.value] ?? format(new Date(), "yyyy-MM-dd");
    return {
      date,
    };
  });

  async function syncRarities() {
    const validGuesses = Object.fromEntries(
      Object.entries(currentDailyGridData.value?.gridState || {})
        .filter(([_, value]) => value)
        .map(([key, value]) => [key, value.value]),
    );

    const rarities = await $fetch("/api/grid/rarity", {
      method: "POST",
      body: {
        date: statsQuery.value.date,
        gridSubmissions: validGuesses,
      },
    });

    await db.transaction("rw", "progress", async () => {
      const progress = await db.progress.get({
        date: statsQuery.value.date,
        mode: "grid",
      });
      if (progress && progress.gridState) {
        const nextGridState = { ...progress.gridState };
        for (const [coord, rarity] of Object.entries(rarities.results)) {
          if (nextGridState[coord]) {
            nextGridState[coord].rarity = rarity;
          }
        }
        await db.progress.put({
          ...progress,
          gridState: nextGridState,
        });
      }
    });
  }

  const { data, status, refresh, pending } = useFetch("/api/stats", {
    query: statsQuery.value,
    key: `puzzle-stats-${statsQuery.value.date}`,
    lazy: true,
  });

  const { isGameOver } = storeToRefs(useGameStateStore());

  watch(isGameOver, (newIsGameOver) => {
    if (newIsGameOver) {
      refresh();
      syncRarities();
    }
  });

  const visibility = useDocumentVisibility();

  watch(visibility, (newVisibility, previousVisibility) => {
    if (newVisibility === "visible" && previousVisibility === "hidden") {
      refresh();
    }
  });

  useIntervalFn(async () => {
    refresh();
  }, 1000 * 60); // every minute

  return {
    stats: data,
    refresh,
    pending,
    status,
  };
});
