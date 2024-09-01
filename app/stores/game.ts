import { format } from "date-fns";
import type { Ability as OriginalAbility, Warframe } from "~~/schemas/warframe";

type gameMode = "classic" | "classicUnlimited" | "ability" | "abilityUnlimited";

type Ability = OriginalAbility & { belongsTo: string };

type itemToGuess = {
  classic: Warframe | null;
  classicUnlimited: Warframe | null;
  ability: Ability | null;
  abilityUnlimited: Ability | null;
};

export type FixedGuessArray = [number, number, number, number, number, number];

export const useGameStore = defineStore(
  "game",
  () => {
    const mode = ref<gameMode | null>(null);
    const warframes = ref<Warframe[]>([]);
    const itemToGuess = ref<itemToGuess>({
      classic: null,
      classicUnlimited: null,
      ability: null,
      abilityUnlimited: null,
    });
    const stats = ref({
      classic: {
        plays: 0,
        wins: 0,
        guesses: [0, 0, 0, 0, 0, 0] as FixedGuessArray,
        streak: 0,
        maxStreak: 0,
      },
      ability: {
        plays: 0,
        wins: 0,
        guesses: [0, 0, 0, 0, 0, 0] as FixedGuessArray,
        streak: 0,
        maxStreak: 0,
      },
    });

    const isGameOver = ref({
      classic: false,
      classicUnlimited: false,
      ability: false,
      abilityUnlimited: false,
    });

    const defaultAttempts = 6;

    const attempts = ref({
      classic: defaultAttempts,
      classicUnlimited: defaultAttempts,
      ability: defaultAttempts,
      abilityUnlimited: defaultAttempts,
    });

    const route = useRoute();

    const currentDailyDate = ref(format(new Date(), "yyyy-MM-dd"));
    const dailyDate = ref<string>(
      (route.query.date as string) || currentDailyDate.value,
    );

    const guessedItems = ref({
      classic: [] as Warframe[],
      classicUnlimited: [] as Warframe[],
      ability: [] as Warframe[],
      abilityUnlimited: [] as Warframe[],
    });

    function classicInit() {
      if (warframes.value.length === 0) return;
      if (!itemToGuess.value.classicUnlimited) {
        itemToGuess.value.classicUnlimited = warframes.value[
          Math.floor(Math.random() * warframes.value.length)
        ] as Warframe;
      }
    }

    function abilityInit() {
      if (abilities.value.length === 0) return;
      if (!itemToGuess.value.abilityUnlimited) {
        itemToGuess.value.abilityUnlimited = abilities.value[
          Math.floor(Math.random() * abilities.value.length)
        ] as Ability;
      }
    }

    async function fetchWarframes() {
      try {
        const { warframes: data } = await $fetch("/api/warframes");
        warframes.value = data;
      } catch (error) {
        console.error(error);
      }
    }

    function resetDailyValues() {
      guessedItems.value.classic = [];
      guessedItems.value.ability = [];
      attempts.value.classic = defaultAttempts;
      attempts.value.ability = defaultAttempts;
      isGameOver.value.classic = false;
      isGameOver.value.ability = false;
    }

    async function getDaily() {
      //if todays date is the same as the servers date, then I fetch the daily because it is possible for the date to be the same without the daily being fetched
      // if the date isn't the same then I also fetch the
      dailyDate.value =
        (route.query.date as string) ?? format(new Date(), "yyyy-MM-dd");

      if (currentDailyDate.value !== dailyDate.value) {
        resetDailyValues();
        currentDailyDate.value = dailyDate.value;
      }
      try {
        const { daily: data } = await $fetch(
          `/api/daily?date=${dailyDate.value}`,
        );
        itemToGuess.value.classic = warframes.value.find(
          (warframe) => warframe.name === data.classicId,
        ) as Warframe;
        itemToGuess.value.ability = abilities.value.find(
          (ability) => ability.name === data.abilityId,
        ) as Ability;
      } catch (error) {
        console.error(error);
      }
    }

    function resetGame() {
      if (!mode.value) return;
      attempts.value[mode.value] = 6;
      guessedItems.value[mode.value] = [];
      isGameOver.value[mode.value] = false;

      if (mode.value === "classicUnlimited") {
        itemToGuess.value.classicUnlimited = warframes.value[
          Math.floor(Math.random() * warframes.value.length)
        ] as Warframe;
      }
      if (mode.value === "abilityUnlimited") {
        itemToGuess.value.abilityUnlimited = abilities.value[
          Math.floor(Math.random() * abilities.value.length)
        ] as Ability;
      }
    }

    const abilities = computed(() =>
      warframes.value
        .filter(
          (warframe) =>
            !warframe.isPrime && warframe.name !== "Excalibur Umbra",
        )
        .map((warframe) =>
          warframe.abilities.map((ability) => ({
            ...ability,
            belongsTo: warframe.name,
          })),
        )
        .flat(),
    );

    const vanillaWarframes = computed(() =>
      warframes.value.filter(
        (warframe) => !warframe.isPrime && warframe.name !== "Excalibur Umbra",
      ),
    );

    return {
      mode,
      warframes,
      attempts,
      itemToGuess,
      guessedItems,
      stats,
      dailyDate,
      defaultAttempts,
      abilities,
      currentDailyDate,
      vanillaWarframes,
      isGameOver,
      fetchWarframes,
      classicInit,
      abilityInit,
      getDaily,
      resetGame,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      paths: [
        "stats",
        "guessedItems",
        "attempts",
        "itemToGuess",
        "isGameOver",
        "dailyDate",
        "currentDailyDate",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
