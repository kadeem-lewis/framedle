export const useArchiveStore = defineStore("archive", () => {
  const route = useRoute("archive");
  const selectedArchiveMode = ref(
    (route.query.mode as "classic" | "ability") || "classic",
  );
  const order = ref<"OLDEST" | "NEWEST">("NEWEST");

  const pastDays = useLiveQuery(async () => {
    const mode = selectedArchiveMode.value;
    const shouldReverse = order.value === "NEWEST";
    return await db.transaction("r", "dailies", "progress", async () => {
      const puzzleQuery = db.dailies.where({ mode });
      if (shouldReverse) {
        puzzleQuery.reverse();
      }
      const puzzles = await puzzleQuery.toArray();
      if (puzzles.length === 0) return [];

      const progresses = await db.progress.where({ mode }).toArray();

      // Create a Map for fast lookups (more efficient than repeated .find())
      const progressMap = new Map(progresses.map((p) => [p.day, p]));

      return puzzles.map((puzzle) => {
        const progress = progressMap.get(puzzle.day);
        return {
          ...puzzle,
          state: progress?.state,
        };
      });
    });
  }, [selectedArchiveMode, order]);

  const totalArchiveGames = computed(() =>
    pastDays.value ? pastDays.value.length : 0,
  );

  const inProgressDaysCount = useLiveQuery(
    () =>
      db.progress
        .where({ mode: selectedArchiveMode.value, state: GameStatus.ACTIVE })
        .count(),
    [selectedArchiveMode],
  );

  const completedDaysCount = useLiveQuery(
    () =>
      db.progress
        .where("state")
        .notEqual(GameStatus.ACTIVE)
        .and((progress) => progress.mode === selectedArchiveMode.value)
        .count(),
    [selectedArchiveMode],
  );
  const randomPastDay = computed(() => {
    if (!pastDays.value || pastDays.value.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pastDays.value.length);
    return randomIndex;
  });

  const attemptedCount = computed(() => {
    return (inProgressDaysCount.value ?? 0) + (completedDaysCount.value ?? 0);
  });

  const notStartedDaysCount = computed(() => {
    const notStarted = totalArchiveGames.value - attemptedCount.value;
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
    pastDays,
    selectedArchiveMode,
    order,
    totalArchiveGames,
    inProgressDaysCount,
    completedDaysCount,
    notStartedDaysCount,
    randomPastDay,
    getAdjacentArchiveDays,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStateStore, import.meta.hot));
}
