import type { PiniaPluginContext } from "pinia";

export function convertVersionOneGameData(context: PiniaPluginContext) {
  const store = context.store;
  const gameDataVersionOne = localStorage.getItem("game");
  if (!gameDataVersionOne) return;
  try {
    const parsed = JSON.parse(gameDataVersionOne);
    console.log("Migrating version one game data:", parsed);
    if (parsed.itemToGuess?.classicUnlimited) {
      console.log("does classic unlimited guess run?");
      store.itemToGuess.classicUnlimited =
        parsed.itemToGuess.classicUnlimited.name;
    }
    if (parsed.itemToGuess?.abilityUnlimited) {
      store.itemToGuess.abilityUnlimited = parsed.itemToGuess.abilityUnlimited;
    }
    if (parsed.attempts?.classicUnlimited) {
      store.attempts.classicUnlimited = parsed.attempts.classicUnlimited;
    }
    if (parsed.attempts?.abilityUnlimited) {
      console.log("does attempts run?");
      store.attempts.abilityUnlimited = parsed.attempts.abilityUnlimited;
    }
    if (parsed.guessedItems?.classicUnlimited) {
      if (Array.isArray(parsed.guessedItems.classicUnlimited)) {
        console.log("its an array");
        store.guessedItems.classicUnlimited =
          parsed.guessedItems.classicUnlimited.map(
            (item: { name: string }) => item.name,
          );
      } else {
        console.log("its not an array");
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
