import { format } from "date-fns";
import type { Daily } from "#shared/schemas/db";
import { switchMap } from "rxjs";
import { liveQuery } from "dexie";

export const useDailiesStore = defineStore("dailies", () => {
  const lastFetchedDate = useLocalStorage("lastFetchedDate", "");
  const selectedArchiveMode = ref<GameMode>();

  // maybe selectedDaily variable should also be here?

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
      const dailies = await $fetch<Daily[]>("/api/dailies", {
        params,
      });
      await db.dailies.bulkAdd(convertDailyDataToEntries(dailies));
      lastFetchedDate.value = currentDate;
    } catch (error) {
      console.error("Error fetching dailies:", error);
    }
  }

  function convertDailyDataToEntries(dailyData: Daily[]) {
    const entries: DailyData[] = [];
    for (const daily of dailyData) {
      const ability = abilities.find(
        (ab) => ab.name === daily.abilityId,
      ) as Ability;
      entries.push(
        {
          day: daily.day,
          date: daily.date,
          attempts: 0,
          guessedItems: [],
          mode: "classic",
          itemToGuess: daily.classicId as WarframeName,
        },
        {
          day: daily.day,
          date: daily.date,
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
    getDailies,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDailiesStore, import.meta.hot));
}
