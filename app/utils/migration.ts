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
  const gameDataVersionTwo = localStorage.getItem("game.v2");
  if (gameDataVersionTwo) {
    convertVersionTwoGameData(gameDataVersionTwo, store);
  }
}

function convertVersionTwoGameData(
  localStorageData: string,
  store: Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>,
) {
  try {
    const unlimited: {
      classicUnlimited: {
        itemToGuess?: string;
        attempts?: number;
        guessedItems?: string[];
      };
      abilityUnlimited: {
        itemToGuess?: string;
        attempts?: number;
        guessedItems?: string[];
        selectedMinigameAbility?: string;
      };
    } = {
      classicUnlimited: {},
      abilityUnlimited: {},
    };
    const parsed = JSON.parse(localStorageData);
    if (parsed.itemToGuess?.classicUnlimited) {
      unlimited.classicUnlimited.itemToGuess =
        parsed.itemToGuess.classicUnlimited;
    }
    if (parsed.itemToGuess?.abilityUnlimited) {
      // retroactively applied conversion of old object to string to align with new data structure
      unlimited.abilityUnlimited.itemToGuess =
        parsed.itemToGuess.abilityUnlimited;
    }
    if (parsed.attempts?.classicUnlimited) {
      unlimited.classicUnlimited.attempts = parsed.attempts.classicUnlimited;
    }
    if (parsed.attempts?.abilityUnlimited) {
      unlimited.abilityUnlimited.attempts = parsed.attempts.abilityUnlimited;
    }
    if (parsed.guessedItems?.classicUnlimited) {
      if (Array.isArray(parsed.guessedItems.classicUnlimited)) {
        unlimited.classicUnlimited.guessedItems =
          parsed.guessedItems.classicUnlimited;
      } else {
        unlimited.classicUnlimited.guessedItems = [
          parsed.guessedItems.classicUnlimited.name,
        ];
      }
    }
    if (parsed.guessedItems?.abilityUnlimited) {
      unlimited.abilityUnlimited.guessedItems =
        parsed.guessedItems.abilityUnlimited;
    }
    if (parsed.selectedMinigameAbility?.abilityUnlimited) {
      unlimited.abilityUnlimited.selectedMinigameAbility =
        parsed.selectedMinigameAbility.abilityUnlimited;
    }
    console.log("Converted version two game data:", unlimited);

    store.unlimited = unlimited;
    localStorage.removeItem("game.v2");
  } catch (error) {
    console.error("Failed to migrate version two game data:", error);
    localStorage.removeItem("game.v2");
  }
}
