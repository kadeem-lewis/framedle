export type GameMode =
  | "classic"
  | "classicUnlimited"
  | "ability"
  | "abilityUnlimited";

export function useGameMode() {
  const route = useRoute();

  const modeLookup: Record<string, Record<string, GameMode>> = {
    classic: {
      default: "classic",
      unlimited: "classicUnlimited",
    },
    ability: {
      default: "ability",
      unlimited: "abilityUnlimited",
    },
  };

  const mode = computed<GameMode | undefined>(() => {
    const routeName = route.name;
    const queryMode = route.query.mode as string | undefined;

    if (modeLookup[routeName]) {
      return modeLookup[routeName][queryMode || "default"];
    }

    return undefined;
  });

  return mode;
}
