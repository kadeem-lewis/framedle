<template>
  <ColorScheme>
    <USelectMenu
      v-model="$colorMode.preference"
      :options="items"
      option-attribute="name"
      value-attribute="value"
      :ui-menu="{
        width: 'w-[325%]',
        padding: 'p-1',
        rounded: 'rounded-none',
        option: {
          rounded: 'rounded-none',
        },
      }"
    >
      <UButton
        variant="outline"
        aria-label="theme-toggle"
        square
        class="border-primary dark:border-primary hover:border-primary border-b-4 border-gray-800 bg-white/75 dark:bg-gray-800/75"
      >
        <UIcon
          name="i-heroicons-sun-solid"
          class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <UIcon
          name="i-heroicons-moon-solid"
          class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
      </UButton>
    </USelectMenu>
  </ColorScheme>
</template>

<script setup lang="ts">
const items = [
  {
    name: "system",
    value: "system",
  },
  {
    name: "light",
    value: "light",
  },
  {
    name: "dark",
    value: "dark",
  },
];
</script>
