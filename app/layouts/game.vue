<script setup lang="ts">
const { activeDays } = storeToRefs(useDailiesStore());
const { gameType, isDaily } = useGameMode();
const route = useRoute<"classic-path" | "ability-path" | "grid-path">();

watch(
  [() => route.params, gameType],
  ([params]) => {
    console.log(activeDays.value);
    if (!isDaily.value || !gameType.value) return;
    const pathParam = params.path;
    const potentialDay = Array.isArray(pathParam)
      ? pathParam.at(-1)
      : pathParam;
    const day = Number(potentialDay);
    if (isValidDayNumber(day)) {
      activeDays.value[gameType.value] = day;
    } else {
      activeDays.value[gameType.value] = undefined;
    }
  },
  { immediate: true },
);
</script>
<template>
  <UContainer
    class="flex min-h-dvh flex-col items-center justify-between gap-y-2"
  >
    <TheNavbar />
    <OptionsBar />
    <main class="flex w-full grow flex-col gap-4">
      <ModeSwitch />
      <NuxtPage />
    </main>
    <TheFooter />
  </UContainer>
</template>
