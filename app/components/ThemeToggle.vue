<template>
  <ColorScheme>
    <USelectMenu
      v-model="$colorMode.preference"
      :options="items"
      selected-icon=""
      option-attribute="name"
      value-attribute="value"
      :ui-menu="{
        width: 'w-[400%]',
        padding: 'p-1',
        rounded: 'rounded-none',
        option: {
          rounded: 'rounded-none',
          size: 'text-base',
        },
      }"
    >
      <UButton
        variant="outline"
        aria-label="theme-toggle"
        square
        class="border-b-4 border-(--ui-primary) border-neutral-800 bg-white/75 hover:border-(--ui-primary) dark:border-(--ui-primary) dark:bg-neutral-900/75"
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
      <template #option="{ option }">
        <UIcon :name="option.icon" class="size-5" />
        <span class="ml-2">{{ option.name }}</span>
      </template>
    </USelectMenu>
  </ColorScheme>
</template>

<script setup lang="ts">
const items = [
  {
    name: "light",
    value: "light",
    icon: "i-heroicons-sun-solid",
  },
  {
    name: "dark",
    value: "dark",
    icon: "i-heroicons-moon-solid",
  },
  {
    name: "system",
    value: "system",
    icon: "i-heroicons-computer-desktop",
  },
];
</script>
