import { format } from "date-fns";
import type { ClassicPuzzle, Daily, GridPuzzle } from "#shared/schemas/db";
import { switchMap } from "rxjs";
import Dexie from "dexie";
const { liveQuery } = Dexie;

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

  const currentDailyClassicData = useObservable(
    from(toRef(activeDays.value, "classic")).pipe(
      switchMap((day) =>
        from(
          liveQuery(async () => {
            const query = {
              mode: "classic" as const,
              ...(day ? { day } : { date: format(new Date(), "yyyy-MM-dd") }),
            };
            return await db.transaction(
              "r",
              "dailies",
              "progress",
              async () => {
                const puzzle = await db.dailies.where(query).first();
                if (!puzzle) return undefined;

                const progress = await db.progress.get([puzzle.day, "classic"]);

                return {
                  ...puzzle,
                  attempts: progress?.attempts ?? DEFAULT_ATTEMPTS,
                  guessedItems: progress?.guessedItems || [],
                  state: progress?.state,
                };
              },
            );
          }),
        ),
      ),
    ),
    { initialValue: undefined },
  ) as Ref<FullClassicData | undefined>;

  const currentDailyAbilityData = useObservable(
    from(toRef(activeDays.value, "ability")).pipe(
      switchMap((day) =>
        from(
          liveQuery(async () => {
            const query = {
              mode: "ability" as const,
              ...(day ? { day } : { date: format(new Date(), "yyyy-MM-dd") }),
            };
            return await db.transaction(
              "r",
              "dailies",
              "progress",
              async () => {
                const puzzle = await db.dailies.where(query).first();
                if (!puzzle) return undefined;

                const progress = await db.progress.get([puzzle.day, "ability"]);

                return {
                  ...puzzle,
                  attempts: progress?.attempts ?? DEFAULT_ATTEMPTS,
                  guessedItems: progress?.guessedItems || [],
                  state: progress?.state,
                  selectedMinigameAbility:
                    progress?.selectedMinigameAbility || "",
                };
              },
            );
          }),
        ),
      ),
    ),
    {
      initialValue: undefined,
    },
  ) as Ref<FullAbilityData | undefined>;

  watch(
    [currentDailyClassicData, currentDailyAbilityData],
    ([newClassicVal, newAbilityVal]) => {
      // this technically works but it needs a lot of improvements
      if (newClassicVal && newAbilityVal) {
        updateDailyData({
          ability: newAbilityVal,
          classic: newClassicVal,
        });
      }
    },
  );

  const currentDailyDate = computed(() => {
    //! this is a temporary change to allow the app to still work, eventually I think this tracker should be individual for each daily game
    return currentDailyClassicData.value?.date || null;
  });

  const isLoadingDailies = ref(false);

  async function getDailies() {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    const latestDailyDate = await db.dailies.orderBy("date").last();
    if (latestDailyDate?.date === currentDate) return;
    isLoadingDailies.value = true;
    const params: {
      since?: string;
      until: string;
    } = {
      until: currentDate,
      since: latestDailyDate?.date,
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
        const abilityPuzzle = puzzle as ClassicPuzzle;
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
        const classicPuzzle = puzzle as ClassicPuzzle;
        entries.push({
          itemToGuess: classicPuzzle.answer as WarframeName,
          mode,
          ...rest,
        });
      }
      if (mode === "grid") {
        entries.push({
          ...rest,
          mode,
          puzzle: puzzle as GridPuzzle,
        });
      }
    }
    return entries;
  }

  return {
    activeDays,
    currentDailyClassicData,
    currentDailyAbilityData,
    currentDailyDate,
    isLoadingDailies,
    getDailies,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDailiesStore, import.meta.hot));
}
