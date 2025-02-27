<template>
  <div class="flex w-full items-center justify-center">
    <menu class="flex gap-2 p-2">
      <UTooltip v-for="item of items" :key="item.text" :text="item.text">
        <UButton
          :aria-label="item.text"
          :icon="item.icon"
          variant="outline"
          size="md"
          square
          @click="item.command"
        />
      </UTooltip>
    </menu>
    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <p class="text-center font-roboto text-xl font-semibold uppercase">
            {{ headerText }}
          </p>
        </template>
        <component
          :is="optionComponents[selectedOption]"
          v-if="optionComponents[selectedOption]"
        />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import {
  ContentAboutGame,
  ContentGameInstructions,
  ContentGameStats,
  ContentSupport,
} from "#components";

const options = {
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
  SUPPORT: "support",
} as const;

type Option = (typeof options)[keyof typeof options];

const selectedOption = useState<Option>("selectedOption");

const isOpen = useState("isOpen", () => false);

const route = useRoute();

const items = [
  {
    text: "Archive",
    icon: "i-heroicons-calendar-solid",
    command: () =>
      navigateTo({ path: "/archive", query: { mode: route.name } }),
  },
  {
    text: "Stats",
    icon: "i-heroicons-chart-bar-solid",
    command: () => {
      isOpen.value = true;
      selectedOption.value = options.STATS;
    },
  },
  {
    text: "About",
    icon: "i-mdi-information-variant",
    command: () => {
      isOpen.value = true;
      selectedOption.value = options.ABOUT;
    },
  },
  {
    text: "Support",
    icon: "i-heroicons-heart",
    command: () => {
      isOpen.value = true;
      selectedOption.value = options.SUPPORT;
    },
  },
  {
    text: "Instructions",
    icon: "i-mdi-help",
    command: () => {
      isOpen.value = true;
      selectedOption.value = options.INSTRUCTIONS;
    },
  },
];

const headerText = computed(() => {
  if (selectedOption.value === options.STATS) {
    return `${route.name} ${selectedOption.value}`;
  }
  return selectedOption.value;
});

const optionComponents = {
  [options.STATS]: ContentGameStats,
  [options.ABOUT]: ContentAboutGame,
  [options.INSTRUCTIONS]: ContentGameInstructions,
  [options.SUPPORT]: ContentSupport,
};
</script>
