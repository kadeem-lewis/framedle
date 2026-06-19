import type {
  _ActionsTree,
  _GettersTree,
  PiniaPluginContext,
  StateTree,
  Store,
} from "pinia";

export function migrateGameData(context: PiniaPluginContext) {
  if (!import.meta.client) {
    return;
  }
  const store = context.store;
  const gameDataVersionOne = localStorage.getItem("game");
  if (gameDataVersionOne) {
    convertVersion1GameData(gameDataVersionOne, store);
  }
  const currentAbility = store.itemToGuess.abilityUnlimited;
  if (
    typeof currentAbility === "object" &&
    currentAbility !== null &&
    "name" in currentAbility
  ) {
    store.itemToGuess.abilityUnlimited = currentAbility.name;
  }
}

function convertVersion1GameData(
  localStorageData: string,
  store: Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>,
) {
  try {
    const parsed = JSON.parse(localStorageData);
    if (parsed.itemToGuess?.classicUnlimited) {
      store.itemToGuess.classicUnlimited =
        parsed.itemToGuess.classicUnlimited.name;
    }
    if (parsed.itemToGuess?.abilityUnlimited) {
      // retroactively applied conversion of old object to string to align with new data structure
      store.itemToGuess.abilityUnlimited =
        parsed.itemToGuess.abilityUnlimited.name;
    }
    if (parsed.attempts?.classicUnlimited) {
      store.attempts.classicUnlimited = parsed.attempts.classicUnlimited;
    }
    if (parsed.attempts?.abilityUnlimited) {
      store.attempts.abilityUnlimited = parsed.attempts.abilityUnlimited;
    }
    if (parsed.guessedItems?.classicUnlimited) {
      if (Array.isArray(parsed.guessedItems.classicUnlimited)) {
        store.guessedItems.classicUnlimited =
          parsed.guessedItems.classicUnlimited.map(
            (item: { name: string }) => item.name,
          );
      } else {
        store.guessedItems.classicUnlimited = [
          parsed.guessedItems.classicUnlimited.name,
        ];
      }
    }
    if (parsed.guessedItems?.abilityUnlimited) {
      store.guessedItems.abilityUnlimited =
        parsed.guessedItems.abilityUnlimited.map(
          (item: { name: string }) => item.name,
        );
    }

    localStorage.removeItem("game");
  } catch (error) {
    console.error("Failed to migrate version one game data:", error);
    localStorage.removeItem("game");
  }
}
