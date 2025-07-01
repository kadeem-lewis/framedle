import { format } from "date-fns";
import type { Daily } from "#shared/schemas/db";

type itemToGuess = {
  classic: WarframeName | null;
  classicUnlimited: WarframeName | null;
  ability: Ability | null;
  abilityUnlimited: Ability | null;
};

export const useGameStore = defineStore(
  "game.v2",
  () => {
    const itemToGuess = ref<itemToGuess>({
      classic: null,
      classicUnlimited: null,
      ability: null,
      abilityUnlimited: null,
    });

    const defaultAttempts = 6;

    const attempts = ref({
      classic: defaultAttempts,
      classicUnlimited: defaultAttempts,
      ability: defaultAttempts,
      abilityUnlimited: defaultAttempts,
    });

    const route = useRoute("classic-path");
    const router = useRouter();

    const currentDailyDate = ref(format(new Date(), "yyyy-MM-dd"));

    const lastPath = computed(() => {
      if (!route.params.path) return null;
      return route.params.path.at(-1);
    });

    const selectedDaily = ref<Daily | null>(null);

    const guessedItems = ref({
      classic: [] as WarframeName[],
      classicUnlimited: [] as WarframeName[],
      ability: [] as WarframeName[],
      abilityUnlimited: [] as WarframeName[],
    });

    const selectedMinigameAbility = ref({
      ability: "",
      abilityUnlimited: "",
    });

    const { decode } = useEncoder();

    //TODO: both init functions could be the same function and just pass the mode as an argument
    function classicInit() {
      if (route.query.x && lastPath.value === "unlimited") {
        const decoded = decode(route.query.x as string) as WarframeName;
        const decodedWarframe = getWarframe(decoded);
        if (itemToGuess.value.classicUnlimited !== decodedWarframe.name) {
          itemToGuess.value.classicUnlimited = decodedWarframe.name;
          guessedItems.value.classicUnlimited = [];
          attempts.value.classicUnlimited = defaultAttempts;
        }
      }
      if (!itemToGuess.value.classicUnlimited) {
        itemToGuess.value.classicUnlimited =
          warframeNames[Math.floor(Math.random() * warframeNames.length)] ??
          null;
      }
    }

    function abilityInit() {
      if (route.query.x && lastPath.value === "unlimited") {
        const decoded = decode(route.query.x as string);

        const decodedAbility = abilities.find(
          (ability) => ability.name === decoded,
        ) as Ability;
        if (itemToGuess.value.abilityUnlimited?.name !== decodedAbility.name) {
          itemToGuess.value.abilityUnlimited = decodedAbility;
          guessedItems.value.abilityUnlimited = [];
          attempts.value.abilityUnlimited = defaultAttempts;
        }
      }
      if (!itemToGuess.value.abilityUnlimited) {
        itemToGuess.value.abilityUnlimited = abilities[
          Math.floor(Math.random() * abilities.length)
        ] as Ability;
      }
    }

    function resetDailyValues() {
      guessedItems.value.classic = [];
      guessedItems.value.ability = [];
      attempts.value.classic = defaultAttempts;
      attempts.value.ability = defaultAttempts;
      selectedMinigameAbility.value.ability = "";
    }

    async function getDaily() {
      //if todays date is the same as the servers date, then I fetch the daily because it is possible for the date to be the same without the daily being fetched

      const previousDay = selectedDaily.value?.day;

      let query: { day: number } | { date: string };
      let expectedDay: number | null = null;

      if (lastPath.value && isValidDayNumber(lastPath.value)) {
        expectedDay = Number(lastPath.value);
        query = { day: expectedDay };
      } else {
        const todayDate = format(new Date(), "yyyy-MM-dd");
        query = { date: todayDate };
        currentDailyDate.value = todayDate;
      }

      // Reset if switching to a different day
      if (previousDay && expectedDay && previousDay !== expectedDay) {
        resetDailyValues();
      }

      try {
        const { daily: data } = await $fetch<{
          daily: Daily;
        }>("/api/daily", {
          query,
        });

        // Reset if the fetched day is different from what we had
        if (previousDay && previousDay !== data.day) {
          resetDailyValues();
        }

        itemToGuess.value.classic = getWarframe(
          data.classicId as WarframeName,
        ).name;
        itemToGuess.value.ability = abilities.find(
          (ability) => ability.name === data.abilityId,
        ) as Ability;
        selectedDaily.value = data;
        currentDailyDate.value = data.date;
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
        itemToGuess.value.classicUnlimited =
          warframeNames[Math.floor(Math.random() * warframeNames.length)] ??
          null;
      }
      if (mode.value === "abilityUnlimited") {
        router.replace("/ability/unlimited");
        itemToGuess.value.abilityUnlimited = abilities[
          Math.floor(Math.random() * abilities.length)
        ] as Ability;
        selectedMinigameAbility.value.abilityUnlimited = "";
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
      pick: [
        "guessedItems",
        "attempts",
        "itemToGuess",
        "dailyDate",
        "currentDailyDate",
        "selectedMinigameAbility",
        "version",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
