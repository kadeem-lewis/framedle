<script setup lang="ts">
const { activeDays } = storeToRefs(useDailiesStore());
const { gameType, isDaily } = useGameMode();
const route = useRoute<"classic-path" | "ability-path" | "grid-path">();

watch(
  [() => route.params, gameType],
  ([params]) => {
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
  <div class="flex min-h-dvh flex-col items-center justify-between gap-4">
    <TheNavbar />
    <UContainer>
      <OptionsBar />
    </UContainer>
    <UContainer class="grow">
      <main class="flex flex-col gap-4">
        <ModeSwitch />
        <NuxtPage />
      </main>
    </UContainer>
    <UContainer>
      <TheFooter />
    </UContainer>
  </div>
</template>
