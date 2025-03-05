<script setup lang="ts">
import {
  ContentAboutGame,
  ContentGameInstructions,
  ContentGameStats,
  ContentSupport,
  ContentGameSettings,
} from "#components";

const props = defineProps<{
  title: string;
  dialogOption: DialogOption;
}>();

const { closeDialog } = useDialog();

const optionComponents = {
  [dialogOptions.STATS]: ContentGameStats,
  [dialogOptions.ABOUT]: ContentAboutGame,
  [dialogOptions.INSTRUCTIONS]: ContentGameInstructions,
  [dialogOptions.SUPPORT]: ContentSupport,
  [dialogOptions.SETTINGS]: ContentGameSettings,
};
</script>
<template>
  <UModal @close="closeDialog">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <p class="text-center font-roboto text-xl font-semibold uppercase">
          {{ props.title }}
        </p>
      </template>
      <component :is="optionComponents[props.dialogOption]" />
    </UCard>
  </UModal>
</template>
