<template>
  <UContainer
    class="flex min-h-dvh flex-col items-center justify-between gap-y-2"
  >
    <SiteNavbar />
    <OptionsBar />
    <main class="w-full grow">
      <NuxtPage />
    </main>
    <SiteFooter />
  </UContainer>
</template>

<script setup lang="ts">
const { fetchWarframes, getDaily } = useGameStore();
const route = useRoute();

await callOnce("warframes", fetchWarframes);

watch(
  () => route.query.date,
  () => {
    getDaily();
  },
  { immediate: true },
);
</script>
