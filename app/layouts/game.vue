<script setup lang="ts">
const { getDaily } = useGameStore();
const route = useRoute();

watch(
  () => route.query.date,
  () => {
    getDaily();
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
