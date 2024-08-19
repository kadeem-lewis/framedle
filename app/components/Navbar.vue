<template>
  <header class="flex w-full items-center justify-between">
    <div>
      <h1 class="text-2xl font-semibold">
        <NuxtLink to="/">Framedle</NuxtLink>
      </h1>
    </div>
    <div class="flex gap-1">
      <UButton
        icon="i-heroicons-calendar-solid"
        variant="ghost"
        @click="
          isOpen = true;
          selectedOption = options.ARCHIVE;
        "
      />
      <UButton
        icon="i-heroicons-chart-bar-solid"
        variant="ghost"
        @click="
          isOpen = true;
          selectedOption = options.STATS;
        "
      />
      <UButton
        icon="i-heroicons-information-circle"
        variant="ghost"
        @click="
          isOpen = true;
          selectedOption = options.ABOUT;
        "
      />
      <UButton
        icon="i-heroicons-question-mark-circle"
        variant="ghost"
        @click="
          isOpen = true;
          selectedOption = options.INSTRUCTIONS;
        "
      />
      <UButton
        icon="i-heroicons-cog-6-tooth-solid"
        variant="ghost"
        @click="
          isOpen = true;
          selectedOption = options.SETTINGS;
        "
      />
    </div>
    <UModal v-model="isOpen"> hi </UModal>
  </header>
</template>

<script setup lang="ts">
const options = {
  ARCHIVE: "archive",
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
  SETTINGS: "settings",
} as const;

type Option = (typeof options)[keyof typeof options];

const selectedOption = ref<Option>();

const isOpen = ref(false);
</script>
