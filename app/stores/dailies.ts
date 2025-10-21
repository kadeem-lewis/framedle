import { format } from "date-fns";
import type { Daily } from "#shared/schemas/db";
import { switchMap } from "rxjs";
import Dexie, { liveQuery } from "dexie";

export type UpdatedDaily = Daily & {
  readableDate: string;
};

export const useDailiesStore = defineStore("dailies", () => {
  const lastFetchedDate = useLocalStorage("lastFetchedDate", "");
  const currentDay = ref();

  const selectedArchiveMode = ref<GameMode>();

  const pastDays = useObservable(
    from(selectedArchiveMode).pipe(
      switchMap((mode) =>
        from(liveQuery(() => db.dailies.where({ mode }).toArray())),
      ),
    ),
  );

  async function getDailies() {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    if (lastFetchedDate.value === currentDate) return;
    const params: {
      since?: string;
      until: string;
    } = {
      until: currentDate,
      since: lastFetchedDate.value || undefined,
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
      lastFetchedDate.value = currentDate;
    } catch (error) {
      console.error("Error fetching dailies:", error);
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
    getDailies,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDailiesStore, import.meta.hot));
}
