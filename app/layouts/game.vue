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
    <SiteNavbar />
    <OptionsBar />
    <main class="flex w-full grow flex-col gap-4">
      <ModeSwitch />
      <NuxtPage />
    </main>
    <SiteFooter />
  </UContainer>
</template>
