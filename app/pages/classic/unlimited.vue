<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Classic Unlimited",
  ogTitle: "Classic Unlimited",
  description: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
  ogDescription: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
});

const gameStore = useGameStore();
const { initializeUnlimitedGame } = gameStore;
const { unlimited } = storeToRefs(gameStore);
const route = useRoute("classic-unlimited");
const { mode } = useGameMode();

await callOnce(
  "classic-setup",
  () => {
    if (!mode.value) return;
    initializeUnlimitedGame(mode.value, route.query.x as string | undefined);
  },
  {
    mode: "navigation",
  },
);
</script>
<template>
  <UiAppSpinner v-if="!unlimited.classicUnlimited.itemToGuess" />
  <ClassicGameShell
    v-else
    :game-state="unlimited.classicUnlimited"
    header="Guess the Warframe"
  />
</template>
