<template>
  <div v-if="mode">
    <p>Game Over!</p>
    <p>
      The answer was
      <span class="font-bold">
        {{ answer }}
      </span>
    </p>
    <p>{{ attempts[mode] > 0 ? "You Won" : "You Lost Sucka" }}</p>
    <div v-if="mode === 'ability' || mode === 'abilityUnlimited'">
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
    </div>
    <UButton
      v-if="mode === 'abilityUnlimited' || mode === 'classicUnlimited'"
      :ui="{
        rounded: false,
      }"
      variant="outline"
      class="font-semibold uppercase"
      @click="resetGame"
      >New Game</UButton
    >
    <div v-else class="flex gap-2">
      <p>New Game in:</p>
      <span class="flex items-center gap-1">
        <UIcon name="mdi-circle-slice-2" class="size-5" />
        <NextGameCountdown :target-date="startOfTomorrow()" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import type { FixedGuessArray } from "~/stores/game";
const { itemToGuess, mode, guessedItems, attempts, isGameOver, stats } =
  storeToRefs(useGameStore());
const { resetGame, defaultAttempts } = useGameStore();

const showGuesses = ref(false);

const isCorrectGuess = computed(() => (guess: string) => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    if (itemToGuess.value[mode.value]?.belongsTo === guess) {
      return true;
    }
  }
  return false;
});

const answer = computed(() => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return itemToGuess.value[mode.value]?.belongsTo;
  } else {
    return itemToGuess.value[mode.value]?.name;
  }
});

watch(isGameOver, (newValue) => {
  if (
    mode.value &&
    newValue[mode.value] &&
    (mode.value === "ability" || mode.value === "classic")
  ) {
    stats.value[mode.value].plays++;
    if (attempts.value[mode.value] > 0) {
      stats.value[mode.value].wins++;
      stats.value[mode.value].streak++;

      const attemptsLeft = defaultAttempts - attempts.value[mode.value];
      // Currently I am not decrementing attempts on wins so it is possible to win in 0 attempts which makes no sense
      if (attemptsLeft === defaultAttempts) {
        stats.value[mode.value].guesses[0]++;
      } else {
        // @ts-expect-error I need to figure out how to properly type this fixed length array to prevent such as error
        stats.value[mode.value].guesses[attemptsLeft - 1]++;
      }

      stats.value[mode.value].guesses[0]++;
    }
  }
});
</script>
