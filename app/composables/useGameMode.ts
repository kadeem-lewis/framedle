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

  return { mode };
}
