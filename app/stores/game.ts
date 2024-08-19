export const useGameStore = defineStore("game", () => {
  const mode = ref("");

  const classic = reactive({
    guesses: 6,
    guessedItems: [],
  });

  function checkGuess(guess, correctAnswer) {}

  function resetGame() {
    classic.guesses = 6;
    classic.guessedItems = [];
  }

  return {
    mode,
    classic,
    checkGuess,
    resetGame,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
