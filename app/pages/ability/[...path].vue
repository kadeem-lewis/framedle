<script setup lang="ts">
definePageMeta({
  layout: "game",
  validate: validateRoute,
});

useSeoMeta({
  title: "Ability Daily",
  ogTitle: "Ability Daily",
  description: () =>
    `Guess the Warframe ability in ${DEFAULT_ATTEMPTS} tries. Each try reveals a tile.`,
  ogDescription: () =>
    `Guess the Warframe ability in ${DEFAULT_ATTEMPTS} tries. Each try reveals a tile.`,
});

const { daily } = storeToRefs(useGameStore());
const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("ability");
});
</script>
<template>
  <div>
    <UiAppSpinner v-if="!daily.ability.itemToGuess" />
    <AbilityGameShell v-else :game-state="daily.ability" />
  </div>
</template>
