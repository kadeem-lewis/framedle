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

    const { currentDailyAbilityData, currentDailyClassicData } =
      storeToRefs(useDailiesStore());

    const itemToGuess = computed(() => ({
      classic: currentDailyClassicData.value?.itemToGuess ?? null,
      classicUnlimited: unlimitedState.value.itemToGuess.classicUnlimited,
      ability: currentDailyAbilityData.value?.itemToGuess ?? null,
      abilityUnlimited: unlimitedState.value.itemToGuess.abilityUnlimited,
    }));

    const attempts = computed(() => ({
      classic: currentDailyClassicData.value?.attempts ?? defaultAttempts,
      classicUnlimited: unlimitedState.value.attempts.classicUnlimited,
      ability: currentDailyAbilityData.value?.attempts ?? defaultAttempts,
      abilityUnlimited: unlimitedState.value.attempts.abilityUnlimited,
    }));

    const guessedItems = computed(() => ({
      classic: currentDailyClassicData.value?.guessedItems ?? [],
      classicUnlimited: unlimitedState.value.guessedItems.classicUnlimited,
      ability: currentDailyAbilityData.value?.guessedItems ?? [],
      abilityUnlimited: unlimitedState.value.guessedItems.abilityUnlimited,
    }));

    const selectedMinigameAbility = computed(() => ({
      ability: currentDailyAbilityData.value?.selectedMinigameAbility ?? "",
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

    const mode = useGameMode();

    const { proxy } = useScriptUmamiAnalytics();

    function resetGame() {
      if (
        mode.value !== "classicUnlimited" &&
        mode.value !== "abilityUnlimited"
      )
        throw createError("Mode not set");
      unlimitedState.value.attempts[mode.value] = 6;
      unlimitedState.value.guessedItems[mode.value] = [];

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
      selectedMinigameAbility,
      unlimitedState,
      version,
      classicInit,
      abilityInit,
      resetGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["unlimitedState", "version"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
