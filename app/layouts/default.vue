<template>
  <UContainer
    class="flex min-h-screen flex-col items-center justify-between gap-y-2"
  >
    <header class="flex w-full items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">
          <NuxtLink to="/">Framedle</NuxtLink>
        </h1>
      </div>
      <div class="flex gap-1">
        <UButton
          icon="i-heroicons-cog-6-tooth-solid"
          variant="ghost"
          @click="isOpen = true"
        />
      </div>
      <UModal v-model="isOpen"><ContentSettings /></UModal>
    </header>
    <main class="grow">
      <NuxtPage />
    </main>
    <Footer />
  </UContainer>
  <UNotifications />
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>
