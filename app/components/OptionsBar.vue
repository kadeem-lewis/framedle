<script setup lang="ts">
import { useStorage } from "@vueuse/core";
const { openDialog } = useDialog();

const route = useRoute();
const { gameType } = useGameMode();
const { proxy } = useScriptUmamiAnalytics();

const items = [
  {
    text: "Archive",
    icon: "i-heroicons-calendar-solid",
    command: () => {
      navigateTo({
        path: "/archive",
        query: { mode: route.path.split("/")[1] },
      });
    },
  },
  {
    text: "Stats",
    icon: "i-heroicons-chart-bar-solid",
    command: () => {
      proxy.track("Opened Options Dialog", { modal: dialogOptions.STATS });
      openDialog(
        dialogOptions.STATS,
        `${gameType.value} ${dialogOptions.STATS}`,
      );
    },
  },
  {
    text: "Support",
    icon: "i-heroicons-heart",
    command: () => {
      proxy.track("Opened Options Dialog", { modal: dialogOptions.SUPPORT });
      openDialog(dialogOptions.SUPPORT);
    },
  },
  {
    text: "How To",
    icon: "i-mdi-help",
    command: () => {
      proxy.track("Opened Options Dialog", {
        modal: dialogOptions.INSTRUCTIONS,
      });
      openDialog(dialogOptions.INSTRUCTIONS);
    },
  },
];

const firstTimePlaying = useStorage(
  "firstTimePlaying",
  {
    classic: true,
    ability: true,
    grid: true,
  },
  localStorage,
  { mergeDefaults: true },
);

watchEffect(() => {
  if (!gameType.value) return;
  if (firstTimePlaying.value[gameType.value]) {
    openDialog(dialogOptions.INSTRUCTIONS);
    firstTimePlaying.value[gameType.value] = false;
  }
});
</script>
<template>
  <menu class="flex w-full items-center justify-center">
    <UFieldGroup class="grid grid-cols-4">
      <UButton
        v-for="item of items"
        :key="item.text"
        :icon="item.icon"
        :aria-label="item.text"
        variant="outline"
        type="button"
        class="flex flex-col gap-px"
        @click="item.command"
      >
        <span class="text-sm uppercase">
          {{ item.text }}
        </span>
      </UButton>
    </UFieldGroup>
  </menu>
</template>
