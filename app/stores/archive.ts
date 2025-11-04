export const useArchiveStore = defineStore(
  "archive",
  () => {
    const route = useRoute("archive");
    const selectedArchiveMode = ref(
      (route.query.mode as "classic" | "ability") || "classic",
    ); // This is making it so the mode is defaulting to classic

    const { DEFAULT_ATTEMPTS } = useGameStore();

    const pastDays = useLiveQuery(async () => {
      const mode = selectedArchiveMode.value;

      // 1. Fetch all puzzles for the selected mode
      const puzzles = await db.dailies.where({ mode }).toArray();
      if (puzzles.length === 0) return [];

      // 2. Fetch all progress entries for that mode
      const progresses = await db.progress.where({ mode }).toArray();

      // 3. Create a Map for fast lookups (more efficient than repeated .find())
      const progressMap = new Map(progresses.map((p) => [p.day, p]));

      // 4. Map over the puzzles and merge with corresponding progress
      return puzzles.map((puzzle) => {
        const progress = progressMap.get(puzzle.day);
        return {
          ...puzzle,
          attempts: progress?.attempts ?? DEFAULT_ATTEMPTS, // Use your game's default max attempts
          guessedItems: progress?.guessedItems || [], // THE FIX: Default to an empty array
          state: progress?.state,
          selectedMinigameAbility: progress?.selectedMinigameAbility, // Can be undefined
        };
      });
    }, [selectedArchiveMode]);

    const totalArchiveGames = computed(() =>
      pastDays.value ? pastDays.value.length : 0,
    );

    // I can use count() for some of these

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

    const notStartedDaysCount = computed(() => {
      if (totalArchiveGames.value === 0) return 0;
      // "Played" is the sum of completed and in-progress games
      const playedCount =
        (inProgressDaysCount.value ?? 0) + (completedDaysCount.value ?? 0);
      // "Not Started" is the total minus the ones already played
      const notStarted = totalArchiveGames.value - playedCount;
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
      totalArchiveGames,
      inProgressDaysCount,
      completedDaysCount,
      notStartedDaysCount,
      randomPastDay,
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
