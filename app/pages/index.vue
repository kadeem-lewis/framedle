<template>
  <div class="space-y-4">
    <p
      class="border border-gray-200 bg-gray-100/75 p-1 text-center text-lg font-semibold uppercase md:text-xl dark:border-gray-600/75 dark:bg-gray-800"
    >
      Test your Warframe Knowledge!
    </p>
    <div class="flex flex-col gap-4">
      <ModeCard v-for="tab of tabs" :key="tab.label" :tab="tab" />
    </div>
  </div>
</template>

<script setup lang="ts">
const img = useImage();

const tabs = [
  {
    label: "Classic",
    route: "/classic",
    source: "/warframe.png",
    background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
    description: "Guess the Warframe",
  },
  {
    label: "Ability",
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    background: img("/backgrounds/helminth.jpg", { format: "webp" }),
    description: "Guess the Ability",
  },
];
</script>
