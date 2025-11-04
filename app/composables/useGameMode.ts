export type GameMode =
  | "classic"
  | "classicUnlimited"
  | "ability"
  | "abilityUnlimited";

//TODO: This needs to be expanded to have a variable for tracking if its a daily or unlimited mode
export function useGameMode() {
  const route = useRoute();

  const modeLookup: Record<string, Record<string, GameMode>> = {
    classic: {
      daily: "classic",
      unlimited: "classicUnlimited",
    },
    ability: {
      daily: "ability",
      unlimited: "abilityUnlimited",
    },
  };

  const mode = computed<GameMode | undefined>(() => {
    const paths = route.path.split("/");
    const routeName = paths[1];
    if (!routeName) return undefined;
    const variant = paths[2] === "unlimited" ? "unlimited" : "daily";

    if (modeLookup[routeName]) {
      return modeLookup[routeName][variant];
    }

    return undefined;
  });

  const dailyModes = computed(() => {
    const modes = Object.values(modeLookup).map((mode) => mode.daily);
    return modes;
  });

  const isDaily = computed(() => {
    return dailyModes.value.includes(mode.value);
  });

  const isUnlimited = computed(() => {
    return !isDaily.value && mode.value !== undefined;
  });

  return { mode, isDaily, isUnlimited };
}
