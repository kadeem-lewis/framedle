<template>
  <div
    v-if="mode && (mode === 'classic' || mode === 'classicUnlimited')"
    class="flex flex-col gap-4"
  >
    <ModeSwitch />
    <ModeUnavailable v-if="!itemToGuess[mode]" />
    <div v-else class="space-y-4">
      <RemainingGuesses />
      <UCard
        :ui="{
          rounded: false,
          divide: false,
        }"
      >
        <template #header>
          <p class="text-primary text-2xl font-bold uppercase">
            Guess the Warframe
          </p>
          <p
            v-if="attempts[mode] === defaultAttempts"
            class="font-semibold uppercase"
          >
            Take a guess to get started!
          </p>
        </template>
        <WarframeSearch v-if="!isGameOver[mode]" :items="warframes" />
      </UCard>
      <div class="overflow-x-auto md:overflow-x-visible">
        <div class="grid w-[140%] grid-cols-6 gap-2 uppercase md:-ml-[20%]">
          <p
            v-for="label of [
              'name',
              'sex',
              'base health',
              'base shield',
              'progenitor element',
              'release year',
            ]"
            :key="label"
            class="self-center justify-self-center text-center font-semibold"
          >
            {{ label }}
          </p>
          <ClassicFeedbackRow
            v-for="warframe of guessedItems[mode]"
            :key="warframe.name"
            :guessed-warframe="warframe"
            :correct-warframe="itemToGuess[mode]"
          />
        </div>
      </div>
      <GameOver v-if="isGameOver[mode]" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { itemToGuess, mode, guessedItems, isGameOver, warframes, attempts } =
  storeToRefs(useGameStore());
const { classicInit, defaultAttempts } = useGameStore();

await callOnce("classic-setup", classicInit);

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

const route = useRoute();

watch(
  () => route.query.mode,
  () => {
    if (!route.query.mode) {
      mode.value = "classic";
    }
    if (route.query.mode === "unlimited") {
      mode.value = "classicUnlimited";
    }
  },
  { immediate: true },
);
</script>
