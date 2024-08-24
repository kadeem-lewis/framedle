<template>
  <div class="flex w-full items-center justify-center">
    <menu class="flex gap-2 p-2">
      <UTooltip text="Archive">
        <UButton
          icon="i-heroicons-calendar-solid"
          variant="outline"
          square
          :ui="{
            rounded: false,
          }"
          @click="
            isOpen = true;
            selectedOption = options.ARCHIVE;
          "
        />
      </UTooltip>
      <UTooltip text="Stats">
        <UButton
          icon="i-heroicons-chart-bar-solid"
          variant="outline"
          square
          :ui="{
            rounded: false,
          }"
          @click="
            isOpen = true;
            selectedOption = options.STATS;
          "
        />
      </UTooltip>
      <UTooltip text="About">
        <UButton
          icon="i-heroicons-information-circle"
          variant="outline"
          square
          :ui="{
            rounded: false,
          }"
          @click="
            isOpen = true;
            selectedOption = options.ABOUT;
          "
        />
      </UTooltip>
      <UTooltip text="Instructions">
        <UButton
          icon="i-heroicons-question-mark-circle"
          variant="outline"
          square
          :ui="{
            rounded: false,
          }"
          @click="
            isOpen = true;
            selectedOption = options.INSTRUCTIONS;
          "
        />
      </UTooltip>
    </menu>
    <UModal v-model="isOpen"> hi </UModal>
  </div>
</template>

<script setup lang="ts">
const options = {
  ARCHIVE: "archive",
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
} as const;

type Option = (typeof options)[keyof typeof options];

const selectedOption = ref<Option>();

const isOpen = ref(false);
</script>
