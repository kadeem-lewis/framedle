import { format } from "date-fns";
import type { Daily } from "#shared/schemas/db";
import { liveQuery } from "dexie";
import { switchMap } from "rxjs";

export const useGameStore = defineStore(
  "game.v2",
  () => {
    const defaultAttempts = 6;

    const unlimitedState = ref({
      attempts: {
        classicUnlimited: defaultAttempts,
        abilityUnlimited: defaultAttempts,
      },
      guessedItems: {
        classicUnlimited: [] as WarframeName[],
        abilityUnlimited: [] as WarframeName[],
      },
      itemToGuess: {
        classicUnlimited: null as WarframeName | null,
        abilityUnlimited: null as Ability | null,
      },
      selectedMinigameAbility: {
        abilityUnlimited: "",
      },
    });

    const router = useRouter();

    const currentDailyDate = ref(format(new Date(), "yyyy-MM-dd"));

    const selectedDaily = ref<Daily | null>(null);
    const currentDay = computed(() => selectedDaily.value?.day);

    const dailyClassicData = useObservable(
      from(currentDay).pipe(
        switchMap((day) =>
          from(
            liveQuery(() => db.dailies.where({ mode: "classic", day }).first()),
          ),
        ),
      ),
    ) as Ref<ClassicDailyData | undefined>;

    const dailyAbilityData = useObservable(
      from(currentDay).pipe(
        switchMap((day) =>
          from(
            liveQuery(() => db.dailies.where({ mode: "ability", day }).first()),
          ),
        ),
      ),
    ) as Ref<AbilityDailyData | undefined>;

    const itemToGuess = computed(() => ({
      classic: dailyClassicData.value?.itemToGuess ?? null,
      classicUnlimited: unlimitedState.value.itemToGuess.classicUnlimited,
      ability: dailyAbilityData.value?.itemToGuess ?? null,
      abilityUnlimited: unlimitedState.value.itemToGuess.abilityUnlimited,
    }));

    const attempts = computed(() => ({
      classic: dailyClassicData.value?.attempts ?? defaultAttempts,
      classicUnlimited: unlimitedState.value.attempts.classicUnlimited,
      ability: dailyAbilityData.value?.attempts ?? defaultAttempts,
      abilityUnlimited: unlimitedState.value.attempts.abilityUnlimited,
    }));

    const guessedItems = computed(() => ({
      classic: dailyClassicData.value?.guessedItems ?? [],
      classicUnlimited: unlimitedState.value.guessedItems.classicUnlimited,
      ability: dailyAbilityData.value?.guessedItems ?? [],
      abilityUnlimited: unlimitedState.value.guessedItems.abilityUnlimited,
    }));

    const selectedMinigameAbility = computed(() => ({
      ability: dailyAbilityData.value?.selectedMinigameAbility ?? "",
      abilityUnlimited:
        unlimitedState.value.selectedMinigameAbility.abilityUnlimited,
    }));

    const { decode } = useEncoder();

    //TODO: both init functions could be the same function and just pass the mode as an argument
    function classicInit() {
      const route = useRoute("classic-path");
      const lastPath = route.params.path?.at(-1);
      if (route.query.x && lastPath === "unlimited") {
        const decoded = decode(route.query.x as string) as WarframeName;
        const decodedWarframe = getWarframe(decoded);
        if (
          unlimitedState.value.itemToGuess.classicUnlimited !==
          decodedWarframe.name
        ) {
          unlimitedState.value.itemToGuess.classicUnlimited =
            decodedWarframe.name;
          unlimitedState.value.guessedItems.classicUnlimited = [];
          unlimitedState.value.attempts.classicUnlimited = defaultAttempts;
        }
      }
      if (!unlimitedState.value.itemToGuess.classicUnlimited) {
        unlimitedState.value.itemToGuess.classicUnlimited =
          warframeNames[Math.floor(Math.random() * warframeNames.length)] ??
          null;
      }
    }

    function abilityInit() {
      const route = useRoute("ability-path");
      const lastPath = route.params.path?.at(-1);
      if (route.query.x && lastPath === "unlimited") {
        const decoded = decode(route.query.x as string);

        const decodedAbility = abilities.find(
          (ability) => ability.name === decoded,
        ) as Ability;
        if (
          unlimitedState.value.itemToGuess.abilityUnlimited?.name !==
          decodedAbility.name
        ) {
          unlimitedState.value.itemToGuess.abilityUnlimited = decodedAbility;
          unlimitedState.value.guessedItems.abilityUnlimited = [];
          unlimitedState.value.attempts.abilityUnlimited = defaultAttempts;
        }
      }
      if (!unlimitedState.value.itemToGuess.abilityUnlimited) {
        unlimitedState.value.itemToGuess.abilityUnlimited = abilities[
          Math.floor(Math.random() * abilities.length)
        ] as Ability;
      }
    }

    async function getDaily() {
      //if todays date is the same as the servers date, then I fetch the daily because it is possible for the date to be the same without the daily being fetched
      const route = useRoute();
      if (route.name !== "ability-path" && route.name !== "classic-path") {
        return;
      }
      const lastPath = route.params.path?.at(-1);

      let query: { day: number } | { date: string };
      let expectedDay: number | null = null;

      if (lastPath && isValidDayNumber(lastPath)) {
        expectedDay = Number(lastPath);
        query = { day: expectedDay };
      } else {
        const todayDate = format(new Date(), "yyyy-MM-dd");
        query = { date: todayDate };
        currentDailyDate.value = todayDate;
      }

      try {
        const { daily: data } = await $fetch<{
          daily: Daily;
        }>("/api/daily", {
          query,
        });

        selectedDaily.value = data;
        currentDailyDate.value = data.date;

        await db.dailies
          .bulkAdd([
            {
              day: data.day,
              itemToGuess: getWarframe(data.classicId as WarframeName).name,
              mode: "classic",
              date: data.date,
              guessedItems: [],
              attempts: defaultAttempts,
            },
            {
              day: data.day,
              itemToGuess: abilities.find(
                (ability) => ability.name === data.abilityId,
              ) as Ability,
              mode: "ability",
              date: data.date,
              guessedItems: [],
              attempts: defaultAttempts,
              selectedMinigameAbility: "",
            },
          ])
          .catch((e) => {
            // If I throw an error here, it will bubble up to the other catch and cause that error to be thrown
            console.error("Failed to store daily in indexeddb", e);
          });
      } catch (error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to fetch daily",
          data: error,
        });
      }
    }

    const mode = useGameMode();

    const { proxy } = useScriptUmamiAnalytics();

    function resetGame() {
      if (!mode.value) throw createError("Mode not set");
      attempts.value[mode.value] = 6;
      guessedItems.value[mode.value] = [];

      proxy.track("started new game", { mode: mode.value });

      if (mode.value === "classicUnlimited") {
        router.replace("/classic/unlimited");
        unlimitedState.value.itemToGuess.classicUnlimited =
          warframeNames[Math.floor(Math.random() * warframeNames.length)] ??
          null;
      }
      if (mode.value === "abilityUnlimited") {
        router.replace("/ability/unlimited");
        unlimitedState.value.itemToGuess.abilityUnlimited = abilities[
          Math.floor(Math.random() * abilities.length)
        ] as Ability;
        unlimitedState.value.selectedMinigameAbility.abilityUnlimited = "";
      }
    }

    const version = ref(1);

    return {
      attempts,
      itemToGuess,
      guessedItems,
      defaultAttempts,
      currentDailyDate,
      selectedDaily,
      selectedMinigameAbility,
      unlimitedState,
      version,
      classicInit,
      abilityInit,
      getDaily,
      resetGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["unlimitedState", "currentDailyDate", "version"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
