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
  <ClassicGameShell
    :game-state="unlimited.classicUnlimited"
    :is-loading="!unlimited.classicUnlimited.itemToGuess"
    header="Guess the Warframe"
  />
</template>
