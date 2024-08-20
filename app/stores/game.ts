import type { Warframe } from "~~/types/warframe";

type gameMode = "classic" | "classicUnlimited" | "ability" | "abilityUnlimited";

type WarframeToGuess = {
  classic: Warframe | null;
  classicUnlimited: Warframe | null;
  ability: null;
  abilityUnlimited: null;
};

export const useGameStore = defineStore(
  "game",
  () => {
    const mode = ref<gameMode | null>("classicUnlimited");
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
      ability: [],
      abilityUnlimited: [],
    });

    function classicInit() {
      warframeToGuess.value.classic =
        warframes.value[Math.floor(Math.random() * warframes.value.length)];
    }

    async function fetchWarframes() {
      try {
        const { warframes: data } = await $fetch("/api/warframes");
        warframes.value = data;
      } catch (error) {
        console.error(error);
      }
    }

    function resetGame() {
      if (!mode.value) return;
      guesses.value[mode.value] = 6;
      guessedItems.value[mode.value] = [];

      if (mode.value === "classicUnlimited") {
        warframeToGuess.value.classicUnlimited =
          warframes.value[Math.floor(Math.random() * warframes.value.length)];
      }
    }

    const abilities = computed(() =>
      warframes.value.map((wf) => wf.abilities).flat(),
    );

    return {
      mode,
      warframes,
      guesses,
      warframeToGuess,
      guessedItems,
      stats,
      abilities,
      isGameOver,
      fetchWarframes,
      classicInit,
      resetGame,
    };
  },
  {
    persist: {
      paths: [
        "stats",
        "guessedItems.classicUnlimited",
        "guesses.classicUnlimited",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
