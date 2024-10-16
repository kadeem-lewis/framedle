<template>
  <ColorScheme>
    <UDropdown v-model="$colorMode.preference" :items="items">
      <UButton
        variant="outline"
        name="theme-toggle"
        square
        class="border-primary dark:border-primary hover:border-primary border-b-4 border-gray-800"
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
    </UDropdown>
  </ColorScheme>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const items = [
  [
    {
      label: "system",
      click: () => {
        colorMode.preference = "system";
      },
    },
  ],
  [
    {
      label: "light",
      click: () => {
        colorMode.preference = "light";
      },
    },
  ],
  [
    {
      label: "dark",
      click: () => {
        colorMode.preference = "dark";
      },
    },
  ],
];
</script>
