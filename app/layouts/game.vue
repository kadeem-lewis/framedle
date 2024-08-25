<template>
  <UContainer
    class="flex min-h-screen flex-col items-center justify-between gap-y-2"
  >
    <Navbar />
    <OptionsBar />
    <main class="w-full grow">
      <NuxtPage />
    </main>
    <Footer />
  </UContainer>
  <UNotifications />
</template>

<script setup lang="ts">
const { fetchWarframes, getDaily } = useGameStore();

await callOnce(fetchWarframes);
await callOnce(getDaily);
</script>
