import { format } from "date-fns";
import type { Daily } from "#shared/schemas/db";
import { switchMap } from "rxjs";
import Dexie, { liveQuery } from "dexie";

export type UpdatedDaily = Daily & {
  readableDate: string;
};

export const useDailiesStore = defineStore("dailies", () => {
  const currentDay = ref();

  const currentDailyClassicData = useObservable(
    from(currentDay).pipe(
      switchMap((day) =>
        from(
          liveQuery(() => db.dailies.where({ mode: "classic", day }).first()),
        ),
      ),
    ),
  ) as Ref<ClassicDailyData | undefined>;

  const currentDailyAbilityData = useObservable(
    from(currentDay).pipe(
      switchMap((day) =>
        from(
          liveQuery(() => db.dailies.where({ mode: "ability", day }).first()),
        ),
      ),
    ),
  ) as Ref<AbilityDailyData | undefined>;

  const route = useRoute("archive");
  const selectedArchiveMode = ref(
    (route.query.mode as "classic" | "ability") || "classic",
  );

  const pastDays = useLiveQuery(
    () => db.dailies.where({ mode: selectedArchiveMode.value }).toArray(),
    [selectedArchiveMode],
  );

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
        dailies: UpdatedDaily[];
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

  function convertDailyDataToEntries(dailyData: UpdatedDaily[]) {
    const entries: DailyData[] = [];
    for (const daily of dailyData) {
      const ability = abilities.find(
        (ab) => ab.name === daily.abilityId,
      ) as Ability;
      entries.push(
        {
          day: daily.day,
          date: daily.date,
          readableDate: daily.readableDate,
          attempts: 0,
          guessedItems: [],
          mode: "classic",
          itemToGuess: daily.classicId as WarframeName,
        },
        {
          day: daily.day,
          date: daily.date,
          readableDate: daily.readableDate,
          attempts: 0,
          guessedItems: [],
          mode: "ability",
          itemToGuess: ability,
          selectedMinigameAbility: "",
        },
      );
    }
    return entries;
  }

  return {
    pastDays,
    currentDay,
    selectedArchiveMode,
    currentDailyClassicData,
    currentDailyAbilityData,
    isLoadingDailies,
    getDailies,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDailiesStore, import.meta.hot));
}
