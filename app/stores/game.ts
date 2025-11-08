export const useGameStore = defineStore(
  "game.v2",
  () => {
    const DEFAULT_ATTEMPTS = 6;

    const router = useRouter();

    const itemToGuess = ref({
      classic: null as WarframeName | null,
      classicUnlimited: null as WarframeName | null,
      ability: null as Ability | null,
      abilityUnlimited: null as Ability | null,
    });

    const attempts = ref({
      classic: DEFAULT_ATTEMPTS,
      classicUnlimited: DEFAULT_ATTEMPTS,
      ability: DEFAULT_ATTEMPTS,
      abilityUnlimited: DEFAULT_ATTEMPTS,
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
      ability: FullAbilityData;
      classic: FullClassicData;
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
    const { mode, gameType, gameVariant } = useGameMode();

    function initializeUnlimitedGame(
      mode: MaybeRef<GameMode>,
      queryValue?: string,
      options: { forceReset?: boolean } = {},
    ) {
      const currentMode = toValue(mode);
      let newItem: WarframeName | Ability | null = null;
      let needsReset = false;
      const { forceReset = false } = options;
      if (queryValue) {
        if (currentMode === "classicUnlimited") {
          const decoded = decode(queryValue) as WarframeName;
          const decodedWarframe = getWarframe(decoded);
          if (itemToGuess.value.classicUnlimited !== decodedWarframe.name) {
            newItem = decodedWarframe.name;
          }
        }
        if (currentMode === "abilityUnlimited") {
          const decoded = decode(queryValue);
          const decodedAbility = abilities.find(
            (ability) => ability.name === decoded,
          ) as Ability;
          if (
            itemToGuess.value.abilityUnlimited?.name !== decodedAbility.name
          ) {
            newItem = decodedAbility;
          }
        }
      }
      if (!itemToGuess.value[currentMode] || forceReset) {
        newItem =
          gameType.value === "classic"
            ? getRandomWarframe()
            : getRandomAbility();
        needsReset = true;
      }

      if (newItem && needsReset) {
        if (currentMode === "classicUnlimited") {
          itemToGuess.value.classicUnlimited = newItem as WarframeName;
        }
        if (currentMode === "abilityUnlimited") {
          itemToGuess.value.abilityUnlimited = newItem as Ability;
          selectedMinigameAbility.value.abilityUnlimited = "";
        }
        guessedItems.value[currentMode] = [];
        attempts.value[currentMode] = DEFAULT_ATTEMPTS;
      }
    }

    const { proxy } = useScriptUmamiAnalytics();

    function resetCurrentGame() {
      if (!mode.value || gameVariant.value !== "unlimited") {
        console.error("Can only reset unlimited game modes");
        return;
      }
      console.log("howdy");

      router.replace(`/${gameType.value}/unlimited`);

      initializeUnlimitedGame(mode.value, undefined, { forceReset: true });

      proxy.track("started new game", { mode: mode.value });
    }

    return {
      attempts,
      itemToGuess,
      guessedItems,
      DEFAULT_ATTEMPTS,
      selectedMinigameAbility,
      updateDailyData,
      initializeUnlimitedGame,
      resetCurrentGame,
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
      afterHydrate(context) {
        convertVersionOneGameData(context);
      },
      debug: true,
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
