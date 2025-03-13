<template>
  <UDropdownMenu
    :items="items"
    selected-icon=""
    option-attribute="name"
    value-attribute="value"
    :ui="{
      content: 'rounded-none hover:rounded-none',
    }"
  >
    <UButton
      variant="outline"
      aria-label="theme-toggle"
      square
      class="border-b-4 border-(--ui-primary) bg-white/75 hover:border-(--ui-primary) dark:border-(--ui-primary) dark:bg-neutral-900/75"
    >
      <UIcon
        name="i-heroicons-sun-solid"
        class="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <UIcon
        name="i-heroicons-moon-solid"
        class="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
    </UButton>
    <template #item="{ item }">
      <UIcon :name="item.icon" class="size-5" />
      <span class="ml-2">{{ item.name }}</span>
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const items = [
  {
    name: "light",
    value: "light",
    icon: "i-heroicons-sun-solid",
    onSelect: () => {
      colorMode.preference = "light";
    },
  },
  {
    name: "dark",
    value: "dark",
    icon: "i-heroicons-moon-solid",
    onSelect: () => {
      colorMode.preference = "dark";
    },
  },
  {
    name: "system",
    value: "system",
    icon: "i-heroicons-computer-desktop",
    onSelect: () => {
      colorMode.preference = "system";
    },
  },
];
</script>
