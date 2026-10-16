<script setup lang="ts">
definePageMeta({
  layout: "game",
  validate: validateRoute,
});

useSeoMeta({
  title: "Classic Daily",
  ogTitle: "Classic Daily",
  description: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
  ogDescription: () =>
    `Guess the Warframe in ${DEFAULT_ATTEMPTS} tries. Each try reveals more information about the Warframe.`,
});

const { daily } = storeToRefs(useGameStore());
const {
  currentDailyClassicIsLoading,
  currentDailyClassicError,
  isLoadingDailies,
} = storeToRefs(useDailiesStore());

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("classic");
});
</script>
<template>
  <div>
    <ModeUnavailable v-if="currentDailyClassicError" />
    <ClassicGameShell
      v-else
      :game-state="daily.classic"
      :is-loading="currentDailyClassicIsLoading || isLoadingDailies"
      header="Guess Today's Warframe"
    />
  </div>
</template>
