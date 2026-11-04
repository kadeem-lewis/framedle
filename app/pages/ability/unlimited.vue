<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Ability Unlimited",
  ogTitle: "Ability Unlimited",
  description: () =>
    `Guess the Warframe ability in ${DEFAULT_ATTEMPTS} tries. Each try reveals a tile.`,
  ogDescription: () =>
    `Guess the Warframe ability in ${DEFAULT_ATTEMPTS} tries. Each try reveals a tile.`,
});

const gameStore = useGameStore();
const { initializeUnlimitedGame } = gameStore;
const { unlimited } = storeToRefs(gameStore);
const { mode } = useGameMode();
const route = useRoute("ability-unlimited");

await callOnce(
  "ability-setup",
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
  <AbilityGameShell
    :game-state="unlimited.abilityUnlimited"
    :is-loading="!unlimited.abilityUnlimited.itemToGuess"
  />
</template>
