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
const { currentDailyAbilityIsLoading, currentDailyAbilityError } =
  storeToRefs(useDailiesStore());

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("ability");
});
</script>
<template>
  <div>
    <ModeUnavailable v-if="currentDailyAbilityError" />
    <AbilityGameShell
      v-else
      :game-state="daily.ability"
      :is-loading="currentDailyAbilityIsLoading"
    />
  </div>
</template>
