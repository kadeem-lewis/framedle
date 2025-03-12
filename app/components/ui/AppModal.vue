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
        divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
      }"
    >
      <template #header>
        <p class="font-roboto text-center text-xl font-semibold uppercase">
          {{ props.title }}
        </p>
      </template>
      <component :is="optionComponents[props.dialogOption]" />
    </UCard>
  </UModal>
</template>
