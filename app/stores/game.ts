export const useGameStore = defineStore(
  "game.v3",
  () => {
    const router = useRouter();

    const unlimited = ref({
      classicUnlimited: {
        type: "classic",
        variant: "unlimited",
        itemToGuess: null as WarframeName | null,
        attempts: DEFAULT_ATTEMPTS,
        guessedItems: [] as WarframeName[],
      },
      abilityUnlimited: {
        type: "ability",
        variant: "unlimited",
        itemToGuess: null as AbilityName | null,
        attempts: DEFAULT_ATTEMPTS,
        guessedItems: [] as WarframeName[],
        selectedMinigameAbility: "",
      },
    });

    function createPlaceholderDaily(gameType: "classic" | "ability") {
      return {
        type: gameType,
        variant: "daily",
        itemToGuess: null,
        attempts: DEFAULT_ATTEMPTS,
        guessedItems: [] as WarframeName[],
      };
    }

    const { currentDailyClassicData, currentDailyAbilityData } =
      storeToRefs(useDailiesStore());

    const daily = computed(() => {
      const classicDailyData = currentDailyClassicData.value;
      const abilityDailyData = currentDailyAbilityData.value;

      const finalClassicDailyData =
        classicDailyData ?? createPlaceholderDaily("classic");
      const finalAbilityDailyData = abilityDailyData ?? {
        ...createPlaceholderDaily("ability"),
        selectedMinigameAbility: "",
      };

      return {
        classic: {
          ...finalClassicDailyData,
          type: "classic",
          variant: "daily",
        },
        ability: {
          ...finalAbilityDailyData,
          type: "ability",
          variant: "daily",
        },
      };
    });

    const { mode, gameType, gameVariant, isLegacyMode, isLegacyUnlimitedMode } =
      useGameMode();

    const currentGame = computed(() => {
      const currentMode = mode.value;
      if (!currentMode || !isLegacyMode(currentMode)) return null;
      if (isLegacyUnlimitedMode(currentMode)) {
        return unlimited.value[currentMode];
      }
      return daily.value[currentMode];
    });

    const selectedMinigameAbility = computed(() => {
      if (gameType.value !== "ability") return "";
      if (gameVariant.value === "unlimited")
        return unlimited.value.abilityUnlimited.selectedMinigameAbility;
      return daily.value.ability.selectedMinigameAbility;
    });

    const correctWarframe = computed(() => {
      if (
        currentGame.value?.type === "ability" &&
        currentGame.value?.itemToGuess
      ) {
        return getWarframe(getAbility(currentGame.value.itemToGuess).belongsTo);
      }
      return getWarframe(currentGame.value?.itemToGuess as WarframeName);
    });

    const answer = computed(() => {
      if (
        currentGame.value?.type === "ability" &&
        currentGame.value?.itemToGuess
      ) {
        return getAbility(currentGame.value.itemToGuess).belongsTo;
      }
      return currentGame.value?.itemToGuess;
    });

    const { decode } = useEncoder();

    function initializeUnlimitedGame(
      mode: MaybeRef<GameMode>,
      queryValue?: string,
      options: { forceReset?: boolean } = {},
    ) {
      const currentMode = toValue(mode);
      let newItem: WarframeName | AbilityName | null = null;
      let needsReset = false;
      const { forceReset = false } = options;

      if (!isLegacyUnlimitedMode(currentMode)) {
        console.error("Can only initialize legacy unlimited modes");
        return;
      }

      if (queryValue) {
        //TODO: I need to do a stronger guard here for when decoded's value is not valid.
        if (currentMode === "classicUnlimited") {
          const decoded = decode(queryValue) as WarframeName;
          if (unlimited.value[currentMode].itemToGuess !== decoded) {
            newItem = decoded;
            needsReset = true;
          }
        }
        if (currentMode === "abilityUnlimited") {
          const decoded = decode(queryValue) as AbilityName;
          if (unlimited.value[currentMode].itemToGuess !== decoded) {
            newItem = decoded;
            needsReset = true;
          }
        }
      }
      if (!unlimited.value[currentMode].itemToGuess || forceReset) {
        newItem =
          gameType.value === "classic"
            ? getRandomWarframe()
            : getRandomAbility();
        needsReset = true;
      }

      if (newItem && needsReset) {
        if (currentMode === "classicUnlimited") {
          unlimited.value.classicUnlimited.itemToGuess =
            newItem as WarframeName;
        }
        if (currentMode === "abilityUnlimited") {
          unlimited.value.abilityUnlimited.itemToGuess = newItem as AbilityName;
          unlimited.value.abilityUnlimited.selectedMinigameAbility = "";
        }
        unlimited.value[currentMode].guessedItems = [];
        unlimited.value[currentMode].attempts = DEFAULT_ATTEMPTS;
      }
    }

    const { proxy } = useUmamiAnalytics();

    function resetCurrentGame() {
      if (!mode.value || gameVariant.value !== "unlimited") {
        console.error("Can only reset unlimited game modes");
        return;
      }

      router.replace(`/${gameType.value}/unlimited`);

      initializeUnlimitedGame(mode.value, undefined, { forceReset: true });

      proxy.track("started new game", { mode: mode.value });
    }

    return {
      unlimited,
      daily,
      currentGame,
      DEFAULT_ATTEMPTS,
      selectedMinigameAbility,
      correctWarframe,
      answer,
      initializeUnlimitedGame,
      resetCurrentGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["unlimited"],
      omit: [
        "unlimited.abilityUnlimited.type",
        "unlimited.classicUnlimited.type",
        "unlimited.abilityUnlimited.variant",
        "unlimited.classicUnlimited.variant",
      ],
      afterHydrate(context) {
        migrateGameData(context);
      },
      debug: true,
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
