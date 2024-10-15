<template>
  <div class="flex w-full items-center justify-center">
    <menu class="flex gap-2 p-2">
      <UTooltip text="Archive">
        <UButton
          icon="i-heroicons-calendar-solid"
          variant="outline"
          size="lg"
          square
          @click="
            navigateTo({ path: '/archive', query: { mode: $route.name } })
          "
        />
      </UTooltip>
      <UTooltip text="Stats">
        <UButton
          icon="i-heroicons-chart-bar-solid"
          variant="outline"
          size="lg"
          square
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
          size="lg"
          square
          @click="
            isOpen = true;
            selectedOption = options.ABOUT;
          "
        />
      </UTooltip>
      <UTooltip text="About">
        <UButton
          icon="i-heroicons-heart"
          variant="outline"
          size="lg"
          square
          @click="
            isOpen = true;
            selectedOption = options.SUPPORT;
          "
        />
      </UTooltip>
      <UTooltip text="Instructions">
        <UButton
          icon="i-heroicons-question-mark-circle"
          variant="outline"
          size="lg"
          square
          @click="
            isOpen = true;
            selectedOption = options.INSTRUCTIONS;
          "
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
          <p class="text-center text-xl font-semibold uppercase">
            {{
              selectedOption === options.STATS
                ? `${$route.name} ${selectedOption}`
                : selectedOption
            }}
          </p>
        </template>
        <ContentAboutGame v-if="selectedOption === options.ABOUT" />
        <ContentGameInstructions
          v-if="selectedOption === options.INSTRUCTIONS"
        />
        <ContentGameStats v-if="selectedOption === options.STATS" />
        <ContentSupport v-if="selectedOption === options.SUPPORT" />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const options = {
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
  SUPPORT: "support",
} as const;

type Option = (typeof options)[keyof typeof options];

const selectedOption = useState<Option>("selectedOption");

const isOpen = useState("isOpen", () => false);
</script>
