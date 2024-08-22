import { format, startOfTomorrow } from "date-fns";
import type { Ability, Warframe } from "~~/schemas/warframe";

type gameMode = "classic" | "classicUnlimited" | "ability" | "abilityUnlimited";

type WarframeToGuess = {
  classic: Warframe | null;
  classicUnlimited: Warframe | null;
  ability: Ability | null;
  abilityUnlimited: Ability | null;
};

export const useGameStore = defineStore(
  "game",
  () => {
    const mode = ref<gameMode | null>(null);
    const warframes = ref<Warframe[]>([]);
    const warframeToGuess = ref<WarframeToGuess>({
      classic: null,
      classicUnlimited: null,
      ability: null,
      abilityUnlimited: null,
    });
    const stats = ref({
      plays: 0,
      wins: 0,
      streak: 0,
      maxStreak: 0,
    });

    const isGameOver = ref({
      classic: false,
      classicUnlimited: false,
      ability: false,
      abilityUnlimited: false,
    });

    const guesses = ref({
      classic: 6,
      classicUnlimited: 6,
      ability: 6,
      abilityUnlimited: 6,
    });

    const guessedItems = ref({
      classic: [] as Warframe[],
      classicUnlimited: [] as Warframe[],
      ability: [] as Warframe[],
      abilityUnlimited: [] as Warframe[],
    });

    function classicInit() {
      if (warframes.value.length === 0) return;
      if (!warframeToGuess.value.classicUnlimited) {
        warframeToGuess.value.classicUnlimited = warframes.value[
          Math.floor(Math.random() * warframes.value.length)
        ] as Warframe;
      }
    }

    function abilityInit() {
      if (abilities.value.length === 0) return;
      if (!warframeToGuess.value.abilityUnlimited) {
        warframeToGuess.value.abilityUnlimited = abilities.value[
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

    async function getDaily() {
      const date = format(startOfTomorrow(), "yyyy-MM-dd");
      try {
        const { daily: data } = await $fetch(`/api/dailies?date=${date}`);
        warframeToGuess.value.classic = warframes.value.find(
          (warframe) => warframe.name === data.classicId,
        ) as Warframe;
        warframeToGuess.value.ability = abilities.value.find(
          (ability) => ability.name === data.abilityId,
        ) as Ability;
      } catch (error) {
        console.error(error);
      }
    }

    function resetGame() {
      if (!mode.value) return;
      guesses.value[mode.value] = 6;
      guessedItems.value[mode.value] = [];
      isGameOver.value[mode.value] = false;

      if (mode.value === "classicUnlimited") {
        warframeToGuess.value.classicUnlimited = warframes.value[
          Math.floor(Math.random() * warframes.value.length)
        ] as Warframe;
      }
      if (mode.value === "abilityUnlimited") {
        warframeToGuess.value.abilityUnlimited = abilities.value[
          Math.floor(Math.random() * abilities.value.length)
        ] as Ability;
      }
    }

    const abilities = computed(() =>
      warframes.value
        .map((warframe) =>
          warframe.abilities.map((ability) => ({
            ...ability,
            belongsTo: warframe.name,
          })),
        )
        .flat(),
    );

    const vanillaWarframes = computed(() =>
      warframes.value.filter((warframe) => !warframe.isPrime),
    );

    return {
      mode,
      warframes,
      guesses,
      warframeToGuess,
      guessedItems,
      stats,
      abilities,
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
      paths: [
        "stats",
        "guessedItems.classicUnlimited",
        "guessedItems.abilityUnlimited",
        "guesses.classicUnlimited",
        "guesses.abilityUnlimited",
        "warframeToGuess.classicUnlimited",
        "warframeToGuess.abilityUnlimited",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
