import { format, parseISO, subDays } from "date-fns";
import type { Daily, GridPuzzle, LegacyPuzzle } from "#shared/schemas/db";
import Dexie from "dexie";

export const useDailiesStore = defineStore("dailies", () => {
  const activeDays = ref<{
    classic: number | undefined;
    ability: number | undefined;
    grid: number | undefined;
  }>({
    classic: undefined,
    ability: undefined,
    grid: undefined,
  });

  const { DEFAULT_ATTEMPTS } = useGameStore();

  const { updateDailyData } = useGameStore();

  const { mode, isDailyMode, isDaily } = useGameMode();

  const query = computed(() => {
    if (!mode.value || !isDailyMode(mode.value))
      throw createError("Invalid mode for daily query");
    return {
      mode: mode.value,
      ...(activeDays.value[mode.value]
        ? { day: activeDays.value[mode.value] }
        : { date: format(new Date(), "yyyy-MM-dd") }),
    };
  });

  const currentDailyClassicData = useLiveQuery(async () => {
    return await db.transaction("r", "dailies", "progress", async () => {
      const puzzle = (await db.dailies.where(query.value).first()) as
        | ClassicDailyData
        | undefined;
      if (!puzzle) return undefined;

      const progress = (await db.progress.get([puzzle.day, "classic"])) as
        | ClassicProgressData
        | undefined;

      return {
        ...puzzle,
        attempts: progress?.attempts ?? DEFAULT_ATTEMPTS,
        guessedItems: progress?.guessedItems || [],
        state: progress?.state,
      };
    });
  }, [toRef(activeDays.value, "classic"), isDaily]);

  const currentDailyAbilityData = useLiveQuery(async () => {
    return await db.transaction("r", "dailies", "progress", async () => {
      const puzzle = (await db.dailies.where(query.value).first()) as
        | AbilityDailyData
        | undefined;
      if (!puzzle) return undefined;

      const progress = (await db.progress.get([puzzle.day, "ability"])) as
        | AbilityProgressData
        | undefined;

      return {
        ...puzzle,
        attempts: progress?.attempts ?? DEFAULT_ATTEMPTS,
        guessedItems: progress?.guessedItems || [],
        state: progress?.state,
        selectedMinigameAbility: progress?.selectedMinigameAbility || "",
      };
    });
  }, [toRef(activeDays.value, "ability"), isDaily]);
  // isDaily is included in the deps to ensure game loads when switching from unlimited to daily

  watch(
    [currentDailyClassicData, currentDailyAbilityData],
    ([newClassicVal, newAbilityVal]) => {
      // this technically works but it needs a lot of improvements
      if (newClassicVal || newAbilityVal) {
        updateDailyData({
          ability: newAbilityVal,
          classic: newClassicVal,
        });
      }
    },
  );

  const { syncGridData, MAX_GRID_ATTEMPTS } = useGridGameStore();

  const currentDailyGridData = useLiveQuery(async () => {
    return await db.transaction("r", "dailies", "progress", async () => {
      const puzzle = (await db.dailies.where(query.value).first()) as
        | GridDailyData
        | undefined;
      if (!puzzle) return undefined;

      const progress = (await db.progress.get([puzzle.day, "grid"])) as
        | GridProgressData
        | undefined;

      return {
        ...puzzle,
        attempts: progress?.attempts ?? MAX_GRID_ATTEMPTS,
        state: progress?.state,
        gridState: progress?.gridState || {},
        hasSeenPopup: progress?.hasSeenPopup ?? false,
      };
    });
  }, [toRef(activeDays.value, "grid"), isDaily]);

  watch(currentDailyGridData, (newGridVal) => {
    if (newGridVal) {
      syncGridData(newGridVal);
    }
  });

  const currentDailyDate = computed(() => {
    return {
      classic: currentDailyClassicData.value?.date || null,
      ability: currentDailyAbilityData.value?.date || null,
      grid: currentDailyGridData.value?.date || null,
    };
  });

  async function giveUpGridDaily() {
    if (!currentDailyGridData.value) {
      console.error("No current daily grid data found when giving up.");
      return;
    }
    try {
      const { date, day, gridState } = structuredClone(
        toRaw(currentDailyGridData.value),
      );
      const gridProgress: GridProgressData = {
        date,
        day,
        mode: "grid",
        gridState,
        attempts: 0,
      };
      await db.progress.put(gridProgress);
    } catch (error) {
      console.error("Error giving up grid daily:", error);
    }
  }

  const isLoadingDailies = ref(false);

  const { gameTypes } = useGameMode();

  async function getDailies() {
    const currentDate = format(new Date(), "yyyy-MM-dd");

    const latestEntries = await Promise.all(
      gameTypes.map((mode) => db.dailies.where("mode").equals(mode).last()),
    );

    const isFullySynced = latestEntries.every(
      (entry) => entry?.date === currentDate,
    );

    if (isFullySynced) return;

    isLoadingDailies.value = true;

    const latestDailyEntry = await db.dailies.orderBy("date").last();
    let since = latestDailyEntry?.date;

    if (since === currentDate) {
      since = format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd");
    }
    const params: {
      since?: string;
      until: string;
    } = {
      until: currentDate,
      since,
    };

    try {
      const data = await $fetch<{
        dailies: Daily[];
      }>("/api/dailies", {
        params,
      });

      await db.dailies
        .bulkAdd(convertDailyDataToEntries(data.dailies))
        .catch((error) => {
          if (!(error instanceof Dexie.BulkError)) {
            throw error;
          }
        });
    } catch (error) {
      console.error("Error fetching dailies:", error);
    } finally {
      isLoadingDailies.value = false;
    }
  }

  function convertDailyDataToEntries(dailyData: Daily[]) {
    const entries: DailyData[] = [];
    for (const daily of dailyData) {
      const { puzzle, mode, ...rest } = daily;
      if (mode === "ability") {
        const abilityPuzzle = puzzle as LegacyPuzzle;
        const ability = abilities.find(
          (ab) => ab.name === abilityPuzzle.answer,
        ) as Ability;
        entries.push({
          ...rest,
          itemToGuess: ability,
          mode,
        });
      }
      if (mode === "classic") {
        const classicPuzzle = puzzle as LegacyPuzzle;
        entries.push({
          itemToGuess: classicPuzzle.answer as WarframeName,
          mode,
          ...rest,
        });
      }
      if (mode === "grid") {
        const gridPuzzle = puzzle as GridPuzzle;
        entries.push({
          ...rest,
          mode,
          puzzle: gridPuzzle,
        });
      }
    }
    return entries;
  }

  return {
    activeDays,
    query,
    currentDailyClassicData,
    currentDailyAbilityData,
    currentDailyGridData,
    currentDailyDate,
    isLoadingDailies,
    getDailies,
    giveUpGridDaily,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDailiesStore, import.meta.hot));
}
