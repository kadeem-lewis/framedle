<script setup lang="ts">
const { currentDay } = storeToRefs(useDailiesStore());
const route = useRoute();

watch(
  () => route.params,
  () => {
    if (route.name === "ability-path" || route.name === "classic-path") {
      const day = Number(route.params.path?.at(-1));
      if (!route.params.path || isValidDayNumber(day)) {
        currentDay.value = day;
      }
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
