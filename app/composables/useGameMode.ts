export type GameMode =
  | "classic"
  | "classicUnlimited"
  | "ability"
  | "abilityUnlimited";

export type GameType = "classic" | "ability";
export type GameVariant = "daily" | "unlimited";

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
  } as const;

  const gameType = computed<GameType | undefined>(() => {
    const type = route.path.split("/")[1] as GameType;
    return modeLookup[type] ? type : undefined;
  });

  const gameVariant = computed<GameVariant | undefined>(() => {
    if (!gameType.value) return;
    const variant = route.path.split("/")[2];
    return variant === "unlimited" ? "unlimited" : "daily";
  });

  const mode = computed<GameMode | undefined>(() => {
    if (!gameType.value || !gameVariant.value) return;
    return modeLookup[gameType.value]?.[gameVariant.value];
  });

  const isDaily = computed(() => {
    return gameVariant.value === "daily";
  });

  const isUnlimited = computed(() => {
    return gameVariant.value === "unlimited";
  });

  return { mode, gameType, gameVariant, isDaily, isUnlimited };
}
