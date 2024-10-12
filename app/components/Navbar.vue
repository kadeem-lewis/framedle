<template>
  <header class="flex w-full items-center justify-between pt-2">
    <div>
      <h1 class="text-3xl font-semibold uppercase">
        <NuxtLink to="/">Framedle</NuxtLink>
      </h1>
    </div>
    <div class="flex items-center gap-1">
      <UButton
        icon="i-heroicons-cog-6-tooth-solid"
        variant="outline"
        square
        :ui="{
          rounded: false,
        }"
        class="dark:border-primary hover:border-primary border-b-4 border-gray-800"
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
          <p class="text-center text-xl font-semibold uppercase">Settings</p>
        </template>
        <ContentGameSettings />
      </UCard>
    </UModal>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>
