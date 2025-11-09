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
    text: "About",
    icon: "i-mdi-information-variant",
    command: () => {
      proxy.track("Opened Options Dialog", { modal: dialogOptions.ABOUT });
      openDialog(dialogOptions.ABOUT);
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
  <div class="flex w-full items-center">
    <menu class="flex w-full items-center justify-center gap-3">
      <div
        v-for="item of items"
        :key="item.text"
        class="flex flex-col items-center gap-1"
      >
        <UButton
          :aria-label="item.text"
          :icon="item.icon"
          variant="outline"
          size="lg"
          square
          type="button"
          @click="item.command"
        />
        <p class="text-sm font-semibold uppercase">
          {{ item.text }}
        </p>
      </div>
    </menu>
  </div>
</template>
