<script setup lang="ts">
import { useStorage } from "@vueuse/core";
const { openDialog } = useDialog();

const route = useRoute();

const items = [
  {
    text: "Archive",
    icon: "i-heroicons-calendar-solid",
    command: () => {
      navigateTo({ path: "/archive", query: { mode: route.name } });
    },
  },
  {
    text: "Stats",
    icon: "i-heroicons-chart-bar-solid",
    command: () => {
      openDialog(dialogOptions.STATS, `${route.name} ${dialogOptions.STATS}`);
    },
  },
  {
    text: "About",
    icon: "i-mdi-information-variant",
    command: () => {
      openDialog(dialogOptions.ABOUT);
    },
  },
  {
    text: "Support",
    icon: "i-heroicons-heart",
    command: () => {
      openDialog(dialogOptions.SUPPORT);
    },
  },
  {
    text: "Instructions",
    icon: "i-mdi-help",
    command: () => {
      openDialog(dialogOptions.INSTRUCTIONS);
    },
  },
];

const firstTimePlaying = useStorage("firstTimePlaying", {
  classic: true,
  ability: true,
});

watchEffect(() => {
  const currentRoute = route.name as "ability" | "classic";
  if (firstTimePlaying.value[currentRoute]) {
    openDialog(dialogOptions.INSTRUCTIONS);
    firstTimePlaying.value[currentRoute] = false;
  }
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <menu class="flex gap-2 p-2">
      <UTooltip v-for="item of items" :key="item.text" :text="item.text">
        <UButton
          :aria-label="item.text"
          :icon="item.icon"
          variant="outline"
          size="lg"
          square
          type="button"
          @click="item.command"
        />
      </UTooltip>
    </menu>
  </div>
</template>
