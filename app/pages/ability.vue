<template>
  <div v-if="mode" class="flex flex-col gap-4">
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
          <p class="text-primary text-xl font-bold uppercase">
            Which Warframe has this ability?
          </p>
        </template>
        <AbilityImageToGuess />
        <template #footer>
          <WarframeSearch v-if="!isGameOver[mode]" :items="vanillaWarframes" />
        </template>
      </UCard>

      <AbilityFeedbackArea v-if="!isGameOver[mode]" />
      <GameOver v-if="isGameOver[mode]" />
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { itemToGuess, mode, isGameOver, vanillaWarframes } =
  storeToRefs(useGameStore());
const { abilityInit } = useGameStore();

await callOnce("ability-setup", abilityInit);

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

const route = useRoute();

watch(
  () => route.query.mode,
  () => {
    if (route.query.mode === "unlimited") {
      mode.value = "abilityUnlimited";
    }
    if (!route.query.mode) {
      mode.value = "ability";
    }
  },
  { immediate: true },
);
</script>
