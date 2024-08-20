<script setup lang="ts">
const { fetchWarframes } = useGameStore();

const { error } = await useAsyncData("warframes", () => fetchWarframes());
</script>

<template>
  <UContainer
    class="flex min-h-screen flex-col items-center justify-between gap-y-2"
  >
    <Navbar />
    <main class="grow">
      <NuxtPage />
    </main>
    <Footer />
  </UContainer>
  <UNotifications />
</template>
