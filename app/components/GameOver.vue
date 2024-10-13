<template>
  <UCard v-if="mode">
    <div class="flex flex-col items-center gap-2">
      <p class="uppercase">{{ hasWon ? "You Win!" : "You Lost!" }}</p>

      <div class="space-y-2 text-center">
        <p class="uppercase">The answer was:</p>
        <span class="text-xl font-bold capitalize">
          {{ answer }}
        </span>
        <UiFeedbackTile>
          <NuxtImg
            :src="`https://cdn.warframestat.us/img/${itemToGuess[mode]?.imageName}`"
            :alt="itemToGuess[mode]?.name"
            format="webp"
            class="h-16"
          />
        </UiFeedbackTile>
      </div>
      <p>
        Number of tries:
        <span class="font-semibold">{{
          defaultAttempts - attempts[mode]
        }}</span>
      </p>
      <UButton
        v-if="$route.query.mode"
        :ui="{
          rounded: 'rounded-none',
        }"
        variant="outline"
        class="font-semibold uppercase"
        size="xl"
        @click="resetGame"
        >New Game</UButton
      >
      <ShareButton />
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
            <p>{{ isCorrectGuess(guessedItem.name) ? "✅" : "❌" }}</p>
            <p class="font-semibold uppercase">
              {{ guessedItem.name }}
            </p>
          </li>
        </ul>
      </div>

      <div v-if="!$route.query.mode" class="flex gap-2 text-xl">
        <p>New Game in:</p>
        <span class="flex items-center gap-1">
          <UIcon name="i-mdi-circle-slice-2" class="size-5" />
          <NextGameCountdown :target-date="startOfTomorrow()" />
        </span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {
  format,
  startOfDay,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns";
const {
  itemToGuess,
  mode,
  guessedItems,
  attempts,
  isGameOver,
  stats,
  currentDailyDate,
} = storeToRefs(useGameStore());
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

const hasWon = computed(() => {
  if (!mode.value) return;
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return (
      attempts.value[mode.value] >= 0 &&
      guessedItems.value[mode.value].some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value[mode.value]?.belongsTo,
      )
    );
  }
  if (mode.value === "classic" || mode.value === "classicUnlimited") {
    return (
      attempts.value[mode.value] >= 0 &&
      guessedItems.value[mode.value].some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value[mode.value]?.name,
      )
    );
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

watch(
  isGameOver,
  (newValue) => {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    if (
      (mode.value === "ability" || mode.value === "classic") &&
      newValue[mode.value] &&
      currentDailyDate.value === today &&
      stats.value[mode.value].lastPlayedDate !== today
    ) {
      const currentStats = stats.value[mode.value];
      currentStats.plays++;
      currentStats.lastPlayedDate = today;

      if (hasWon.value) {
        currentStats.wins++;
        const attemptsUsed = defaultAttempts - attempts.value[mode.value];
        // @ts-expect-error I need to figure out how to properly type this fixed length array to prevent such as error
        currentStats.guesses[attemptsUsed - 1]++;
        const lastCorrectDate = currentStats.lastCorrectDate;

        if (!lastCorrectDate) {
          currentStats.streak = 1;
        } else if (
          lastCorrectDate === format(startOfYesterday(), "yyyy-MM-dd")
        ) {
          currentStats.streak++;
        } else {
          currentStats.streak = 1;
        }

        currentStats.maxStreak = Math.max(
          currentStats.maxStreak,
          currentStats.streak,
        );
        currentStats.lastCorrectDate = today;
      } else {
        currentStats.streak = 0;
      }
    }
  },
  { immediate: true },
);
</script>
