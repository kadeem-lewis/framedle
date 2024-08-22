<template>
  <div v-if="mode && isGameOver[mode]">
    <p>Game Over!</p>
    <p>The answer was {{ itemToGuess[mode]?.name }}</p>
    <p>{{ attempts[mode] > 0 ? "You Won" : "You Lost Sucka" }}</p>
    <UButton variant="link" @click="showGuesses = !showGuesses"
      >{{ showGuesses ? "Hide" : "Show" }} guesses</UButton
    >
    <ul v-if="showGuesses">
      <li
        v-for="guessedItem in guessedItems[mode]"
        :key="guessedItem.name"
        class="flex gap-2"
      >
        <UIcon
          :name="
            isCorrectGuess(guessedItem.name)
              ? 'heroicons:check-solid'
              : 'heroicons:x-mark-solid'
          "
        />
        {{ guessedItem.name }}
      </li>
    </ul>
    <UButton
      v-if="mode === 'abilityUnlimited' || mode === 'classicUnlimited'"
      @click="resetGame"
      >New Game</UButton
    >
    <div v-else>
      <p>New Game in:</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, mode, guessedItems, attempts, isGameOver } =
  storeToRefs(useGameStore());
const { resetGame } = useGameStore();

const showGuesses = ref(false);

const isCorrectGuess = computed(() => (guess: string) => {
  if (!mode.value) return;
  if (itemToGuess.value[mode.value]?.name === guess) {
    return true;
  }
  return false;
});
</script>
