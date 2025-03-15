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

const emit = defineEmits(["close"]);

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
  <UModal
    :close="{
      onClick: () => {
        emit('close');
      },
    }"
    :ui="{
      content: 'rounded-none',
    }"
    @update:open="(isOpen) => !isOpen && closeDialog()"
  >
    <template #title>
      <p class="font-roboto text-center text-xl font-semibold uppercase">
        {{ props.title }}
      </p>
    </template>
    <template #description>
      <p class="sr-only">{{ props.title }} dialog</p>
    </template>
    <template #body>
      <component :is="optionComponents[props.dialogOption]" />
    </template>
  </UModal>
</template>
