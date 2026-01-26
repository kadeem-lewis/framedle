<script setup lang="ts">
import {
  ContentAboutGame,
  ContentGameInstructions,
  ContentGameStats,
  ContentSupport,
  ContentGameSettings,
  GridSummary,
} from "#components";

const { title, dialogOption } = defineProps<{
  title: string;
  dialogOption: DialogOption;
}>();

const emit = defineEmits(["close"]);

const { closeDialog } = useDialog();

const optionComponents = {
  [dialogOptions.STATS]: ContentGameStats,
  [dialogOptions.ABOUT]: ContentAboutGame,
  [dialogOptions.INSTRUCTIONS]: ContentGameInstructions,
  [dialogOptions.SUPPORT]: ContentSupport,
  [dialogOptions.SETTINGS]: ContentGameSettings,
  [dialogOptions.SUMMARY]: GridSummary,
};
</script>
<template>
  <UModal
    :close="{
      onClick: () => {
        emit('close');
      },
    }"
    :title
    :ui="{
      content: 'rounded-none',
      title: 'font-roboto text-center text-xl uppercase',
    }"
    @update:open="(isOpen) => !isOpen && closeDialog()"
  >
    <template #description>
      <p class="sr-only">{{ title }} dialog</p>
    </template>
    <template #body>
      <component :is="optionComponents[dialogOption]" />
    </template>
  </UModal>
</template>
