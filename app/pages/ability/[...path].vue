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
const {
  currentDailyAbilityIsLoading,
  currentDailyAbilityError,
  currentDailyAbilityUnavailable,
  isLoadingDailies,
} = storeToRefs(useDailiesStore());

const isDailyLoading = computed(
  () => currentDailyAbilityIsLoading.value || isLoadingDailies.value,
);

const isDailyUnavailable = computed(
  () =>
    (currentDailyAbilityUnavailable.value || currentDailyAbilityError.value) &&
    !isDailyLoading.value,
);

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("ability");
});
</script>
<template>
  <div>
    <ModeUnavailable v-if="isDailyUnavailable" />
    <AbilityGameShell
      v-else
      :game-state="daily.ability"
      :is-loading="isDailyLoading"
    />
  </div>
</template>
