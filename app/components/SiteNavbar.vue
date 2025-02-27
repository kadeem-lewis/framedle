<template>
  <header
    class="flex w-full items-center justify-between border-b border-gray-500 py-2 dark:border-gray-700"
  >
    <div>
      <h1
        class="text-3xl font-bold uppercase tracking-widest [font-stretch:condensed]"
      >
        <NuxtLink to="/">Framedle</NuxtLink>
      </h1>
    </div>
    <div class="flex items-center gap-1">
      <UButton
        aria-label="settings"
        icon="i-heroicons-cog-6-tooth-solid"
        variant="outline"
        square
        class="dark:border-primary hover:border-primary border-b-4 border-gray-800"
        :ui="{
          icon: {
            base: 'flex-shrink-0 transition-transform hover:-rotate-45',
          },
        }"
        @click="isOpen = true"
      />
      <ThemeToggle />
    </div>
    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <p class="text-center font-roboto text-xl font-semibold uppercase">
            Settings
          </p>
        </template>
        <ContentGameSettings />
      </UCard>
    </UModal>
  </header>
</template>
<script setup lang="ts">
const isOpen = ref(false);
</script>
