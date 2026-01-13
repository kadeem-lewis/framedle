export type GameMode =
  | "classic"
  | "classicUnlimited"
  | "ability"
  | "abilityUnlimited"
  | "grid"
  | "gridUnlimited";

export type GameType = "classic" | "ability" | "grid";
export type GameVariant = "daily" | "unlimited";

export type LegacyDailyMode = Extract<GameMode, "classic" | "ability">;
export type LegacyMode = Exclude<GameMode, "grid" | "gridUnlimited">;

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
    grid: {
      daily: "grid",
      unlimited: "gridUnlimited",
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

  function isDailyMode(mode: string): mode is GameType {
    return ["classic", "ability", "grid"].includes(mode);
  }

  function isUnlimitedMode(
    mode: string,
  ): mode is Exclude<GameMode, "classic" | "ability" | "grid"> {
    return ["classicUnlimited", "abilityUnlimited", "gridUnlimited"].includes(
      mode,
    );
  }

  function isLegacyDailyMode(mode: string): mode is LegacyDailyMode {
    return ["classic", "ability"].includes(mode);
  }

  function isLegacyMode(mode: string): mode is LegacyMode {
    return [
      "classic",
      "classicUnlimited",
      "ability",
      "abilityUnlimited",
    ].includes(mode);
  }

  return {
    mode,
    gameType,
    gameVariant,
    isDaily,
    isUnlimited,
    isLegacyDailyMode,
    isLegacyMode,
    isUnlimitedMode,
    isDailyMode,
  };
}
