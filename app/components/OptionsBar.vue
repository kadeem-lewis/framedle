<script setup lang="ts">
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
</script>
<template>
  <menu class="flex w-full items-center justify-center">
    <UFieldGroup class="grid grid-cols-5">
      <UButton
        v-for="item of items"
        :key="item.text"
        :aria-label="item.text"
        variant="outline"
        color="neutral"
        type="button"
        class="group flex flex-col gap-px"
        @click="item.command"
      >
        <template #leading>
          <UIcon
            :name="item.icon"
            class="size-6 text-toned group-hover:text-primary dark:contrast-90"
          />
        </template>
        <span class="text-xs uppercase">
          {{ item.text }}
        </span>
      </UButton>
    </UFieldGroup>
  </menu>
</template>
