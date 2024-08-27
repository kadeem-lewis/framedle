<template>
  <div
    v-if="mode && (mode === 'classic' || mode === 'classicUnlimited')"
    class="flex flex-col gap-4"
  >
    <ModeSwitch />
    <ModeUnavailable v-if="!itemToGuess[mode]" />
    <div v-else class="space-y-4">
      <RemainingGuesses />
      <div class="grid grid-cols-6 gap-2 uppercase md:-ml-[20%] md:w-[140%]">
        <p
          v-for="label of [
            'name',
            'sex',
            'base health',
            'base shield',
            'progenitor',
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
      <WarframeSearch v-if="!isGameOver[mode]" :items="warframes" />
      <GameOver v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { itemToGuess, mode, guessedItems, isGameOver, warframes } =
  storeToRefs(useGameStore());
const { classicInit } = useGameStore();

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
