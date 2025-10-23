export const useGameStore = defineStore(
  "game.v2",
  () => {
    const defaultAttempts = 6;

    const router = useRouter();

    const itemToGuess = ref({
      classic: null as WarframeName | null,
      classicUnlimited: null as WarframeName | null,
      ability: null as Ability | null,
      abilityUnlimited: null as Ability | null,
    });

    const attempts = ref({
      classic: defaultAttempts,
      classicUnlimited: defaultAttempts,
      ability: defaultAttempts,
      abilityUnlimited: defaultAttempts,
    });

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

    function updateDailyData(data: {
      ability: AbilityDailyData;
      classic: ClassicDailyData;
    }) {
      itemToGuess.value.classic = data.classic.itemToGuess;
      itemToGuess.value.ability = data.ability.itemToGuess;
      attempts.value.classic = data.classic.attempts;
      attempts.value.ability = data.ability.attempts;
      guessedItems.value.classic = data.classic.guessedItems;
      guessedItems.value.ability = data.ability.guessedItems;
      selectedMinigameAbility.value.ability =
        data.ability.selectedMinigameAbility;
    }

    const { decode } = useEncoder();

    //TODO: both init functions could be the same function and just pass the mode as an argument
    function classicInit() {
      const route = useRoute("classic-path");
      const lastPath = route.params.path?.at(-1);
      if (route.query.x && lastPath === "unlimited") {
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
      const route = useRoute("ability-path");
      const lastPath = route.params.path?.at(-1);
      if (route.query.x && lastPath === "unlimited") {
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

    const mode = useGameMode();

    const { proxy } = useScriptUmamiAnalytics();

    function resetGame() {
      if (
        mode.value !== "classicUnlimited" &&
        mode.value !== "abilityUnlimited"
      )
        throw createError("Mode not set");
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

    return {
      attempts,
      itemToGuess,
      guessedItems,
      defaultAttempts,
      selectedMinigameAbility,
      updateDailyData,
      classicInit,
      abilityInit,
      resetGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: [
        "attempts.abilityUnlimited",
        "attempts.classicUnlimited",
        "guessedItems.abilityUnlimited",
        "guessedItems.classicUnlimited",
        "itemToGuess.classicUnlimited",
        "itemToGuess.abilityUnlimited",
        "selectedMinigameAbility.abilityUnlimited",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
